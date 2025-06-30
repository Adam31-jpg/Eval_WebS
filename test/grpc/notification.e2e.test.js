// Test gRPC autonome - pas de dépendance aux variables d'environnement
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { Pool } = require('pg');

// Configuration directe
const PROTO_PATH = path.join(
  __dirname,
  '../../src/grpc/notification/notification.proto',
);
const GRPC_URL = 'localhost:50051';

// Base de données
const pool = new Pool({
  host: 'localhost',
  database: 'pgdb',
  user: 'pguser',
  password: 'pgpass',
  port: 5432,
});

// Charger le proto
console.log('Loading proto from:', PROTO_PATH);
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const notificationProto = grpc.loadPackageDefinition(packageDefinition);

// Debug: voir ce qui est chargé
console.log('Loaded packages:', Object.keys(notificationProto));
if (notificationProto.notification) {
  console.log('notification package found');
  console.log(
    'Services available:',
    Object.keys(notificationProto.notification),
  );
}

// Créer le client
const notificationClient =
  new notificationProto.notification.NotificationService(
    GRPC_URL,
    grpc.credentials.createInsecure(),
  );

// Debug: voir les méthodes disponibles
console.log('Client methods:', Object.getOwnPropertyNames(notificationClient));

let roomId = '',
  userId = '',
  reservationId = '',
  notificationId = '';

describe('GRPC Notification Tests', () => {
  beforeAll(async () => {
    // Récupérer un utilisateur existant
    const userRes = await pool.query(`SELECT * FROM "users"`);
    const userRows = userRes.rows;
    expect(userRows.length).toBeGreaterThanOrEqual(1);
    userId = userRows[0].id;

    // Récupérer une room existante
    const roomRes = await pool.query(`SELECT * FROM rooms LIMIT 1`);
    roomId = roomRes.rows[0].id;

    // Créer une réservation
    const reservationRes = await pool.query(
      `INSERT INTO reservations (user_id, room_id, start_time, end_time, status, location, created_at)
       VALUES ($1, $2, NOW(), NOW() + INTERVAL '2 hours', 'PENDING', 'Test location gRPC', NOW())
       RETURNING *`,
      [userId, roomId],
    );
    reservationId = reservationRes.rows[0].id;
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should create a notification', async () => {
    const notification = {
      reservationId: parseInt(reservationId),
      message: 'Hello World',
      notificationDate: new Date().toISOString(),
      isSent: false,
    };

    const createNotification = (notification) => {
      return new Promise((resolve, reject) => {
        notificationClient.Create(notification, (err, response) => {
          if (err) {
            console.error('gRPC Create error:', err);
            reject(err);
          } else {
            resolve(response);
          }
        });
      });
    };

    const response = await createNotification(notification);
    expect(response).toHaveProperty('id');
    expect(response.reservationId).toBe(parseInt(reservationId));
    expect(response.message).toBe('Hello World');
    notificationId = response.id;
  });

  it('should get a notification by ID', async () => {
    const getNotification = (notification) => {
      return new Promise((resolve, reject) => {
        notificationClient.FindOne(notification, (err, response) => {
          if (err) {
            console.error('gRPC FindOne error:', err);
            reject(err);
          } else {
            resolve(response);
          }
        });
      });
    };

    const response = await getNotification({ id: notificationId });
    expect(response).toHaveProperty('id');
    expect(response.id).toBe(notificationId);
  });

  it('should update a notification', async () => {
    const updateNotification = (data) => {
      return new Promise((resolve, reject) => {
        notificationClient.Update(data, (err, response) => {
          if (err) {
            console.error('gRPC Update error:', err);
            reject(err);
          } else {
            resolve(response);
          }
        });
      });
    };

    const updateData = {
      id: notificationId,
      notification: {
        id: notificationId,
        reservationId: parseInt(reservationId),
        message: 'World Hello Updated',
        notificationDate: new Date().toISOString(),
        isSent: true,
      },
    };

    const response = await updateNotification(updateData);
    expect(response).toHaveProperty('id');
    expect(response.message).toBe('World Hello Updated');
  });
});
