const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { closePool, getPool } = require('../utils/db.utils');
const axios = require('axios');

// Charger directement le proto extract
const PROTO_PATH = path.join(__dirname, '../../src/grpc/extract/extract.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const extractProto = grpc.loadPackageDefinition(packageDefinition);
const extractService = new extractProto.extract.ExtractService(
  'localhost:50051',
  grpc.credentials.createInsecure(),
);

let roomId = '',
  userId = '',
  reservationId = '';

describe('GRPC Extract Tests', () => {
  beforeAll(async () => {
    const pool = getPool();

    // Récupérer un utilisateur existant
    const userRes = await pool.query(`SELECT * FROM "users"`);
    const userRows = userRes.rows;
    expect(userRows).toBeDefined();
    expect(userRows.length).toBeGreaterThanOrEqual(1);
    const user = userRows[0];
    userId = user.id;

    // Créer une salle de test
    const roomRes = await pool.query(`
        INSERT INTO rooms (name, capacity, location)
        VALUES ('Test Extract Room', 10, 'Second floor')
        RETURNING *
      `);
    const roomRows = roomRes.rows;
    expect(roomRows).toBeDefined();
    expect(roomRows.length).toBe(1);
    const room = roomRows[0];
    roomId = room.id;

    // Créer une réservation de test
    const reservationRes = await pool.query(
      `
        INSERT INTO reservations (user_id, room_id, start_time, end_time, status, location)
        VALUES ($1, $2, NOW(), NOW() + INTERVAL '2 hours', 'APPROVED', 'Test location') 
        RETURNING *
      `,
      [user.id, room.id],
    );

    const reservationRows = reservationRes.rows;
    expect(reservationRows).toBeDefined();
    expect(reservationRows.length).toBe(1);
    const reservation = reservationRows[0];
    reservationId = reservation.id;

    console.log(
      `✅ Test setup - User: ${userId}, Room: ${roomId}, Reservation: ${reservationId}`,
    );
    await closePool();
  });

  it('should extract data to csv and get back a minio presigned url', (done) => {
    const extractRequest = {
      user_id: parseInt(userId, 10),
    };

    console.log('🔍 Requesting extract for user:', extractRequest);

    extractService.GenerateUserExtract(
      extractRequest,
      async (err, response) => {
        try {
          console.log('📝 Extract response:', response);
          console.log('❌ Extract error:', err);

          expect(err).toBeNull();
          expect(response).toHaveProperty('url');
          expect(response.url).toMatch(/http/);
          expect(response.url).toContain('.csv');

          console.log('🔗 CSV URL:', response.url);

          // Tester le téléchargement du fichier
          const fileResponse = await axios.get(response.url);
          expect(fileResponse.status).toBe(200);
          expect(fileResponse.headers['content-type']).toContain('text/csv');

          console.log(
            '📊 CSV Content preview:',
            fileResponse.data.substring(0, 200),
          );

          // Vérifier le contenu CSV
          const csvContent = fileResponse.data;
          expect(csvContent).toContain('reservation_id');
          expect(csvContent).toContain('user_id');
          expect(csvContent).toContain('room_id');
          expect(csvContent).toContain('start_time');
          expect(csvContent).toContain('end_time');
          expect(csvContent).toContain('status');

          // CORRECTION: Convertir les IDs en chaînes de caractères
          expect(csvContent).toContain(String(reservationId));
          expect(csvContent).toContain(String(userId));
          expect(csvContent).toContain(String(roomId));

          console.log('✅ CSV content validation passed');
          done();
        } catch (testError) {
          console.error('❌ Test assertion failed:', testError);
          done(testError);
        }
      },
    );
  });
});
