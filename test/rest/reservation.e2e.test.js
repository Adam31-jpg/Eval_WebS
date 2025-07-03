const axios = require('axios');
const { getUsrToken } = require('../setup');
const { createRoom, defaultRoom } = require('../utils/room.utils');
const { getUsers } = require('../utils/user.utils');
const { getPool, closePool } = require('../utils/db.utils');
const { Readable } = require('stream');
const csv = require('csv-parser');

const BASE_URL = process.env.API_REST_URL;

describe('Reservations E2E Tests', () => {
  let token;
  let createdRoomId;
  let userId;
  let createdReservationId; // Déclarer la variable ici

  beforeAll(async () => {
    token = getUsrToken();

    const roomRes = await createRoom({
      base_url: process.env.API_REST_URL,
      room: defaultRoom,
      token,
    });
    createdRoomId = roomRes.data.id;

    const usersRes = await getUsers({
      base_url: process.env.API_REST_URL,
      token,
    });
    userId = usersRes.data.users[0].id;
  });

  it('should create a reservation using the created room', async () => {
    // CORRECTION: Utiliser les bons noms de champs selon votre API
    const response = await axios.post(
      `${process.env.API_REST_URL}/api/reservations`,
      {
        userId: userId, // au lieu de user_id
        roomId: createdRoomId, // au lieu de room_id
        location: 'Salle de test',
        startTime: '2025-06-01T10:00:00Z', // au lieu de start_time
        endTime: '2025-06-01T12:00:00Z', // au lieu de end_time
        status: 'PENDING', // Enum value
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    createdReservationId = response.data.id; // Assigner ici
    expect(response.data.userId).toBe(userId);
    expect(response.data.roomId).toBe(createdRoomId);
    // CORRECTION: Accepter les deux formats de date
    expect(response.data.startTime).toMatch(/2025-06-01T10:00:00(\.000)?Z/);
    expect(response.data.endTime).toMatch(/2025-06-01T12:00:00(\.000)?Z/);
    expect(response.data.status).toBe('PENDING');
  });

  it('should get the created reservation by ID in database', async () => {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT *
       FROM reservations
       WHERE id = $1`,
      [createdReservationId],
    );
    expect(rows).toBeDefined();
    expect(rows.length).toBe(1);
    expect(rows[0].userId || rows[0].user_id).toBe(userId);
    expect(rows[0].roomId || rows[0].room_id).toBe(createdRoomId);
    await closePool();
  });

  it('should find a notification in table notifications with this reservation id', async () => {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT *
       FROM notifications
       WHERE "reservation_id" = $1`,
      [createdReservationId],
    );

    expect(rows.length).toBe(1);
    await closePool();
  });

  it('should get the created reservation by ID', async () => {
    const response = await axios.get(
      `${BASE_URL}/api/reservations/${createdReservationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    expect(response.status).toBe(200);
    expect(response.data.id).toBe(createdReservationId);
    expect(response.data.userId || response.data.user?.id).toBe(userId);
    expect(response.data.roomId || response.data.room?.id).toBe(createdRoomId);
  });

  it('should update the reservation times and status', async () => {
    // CORRECTION: Utiliser PATCH au lieu de PUT
    const response = await axios.patch(
      `${BASE_URL}/api/reservations/${createdReservationId}`,
      {
        startTime: '2025-06-02T10:00:00Z',
        endTime: '2025-06-02T12:00:00Z',
        status: 'APPROVED',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(createdReservationId);
    expect(response.data.startTime).toMatch(/2025-06-02T10:00:00(\.000)?Z/);
    expect(response.data.endTime).toMatch(/2025-06-02T12:00:00(\.000)?Z/);
    expect(response.data.status).toBe('APPROVED');
  });

  it('should find a new notification in table notifications with this reservation id', async () => {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT *
       FROM notifications
       WHERE "reservation_id" = $1`,
      [createdReservationId],
    );
    expect(rows).toBeDefined();
    expect(rows.length).toBe(2);
    await closePool();
  });

  it('should list reservations (with pagination)', async () => {
    // On utilise skip=0 / limit=10 à titre d'exemple
    const response = await axios.get(
      `${BASE_URL}/api/reservations?skip=0&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);

    // Optionnel : vérifier si la réservation qu'on vient de créer est dans la liste
    // par exemple en cherchant son ID
    const found = response.data.some((r) => r.id == createdReservationId);
    expect(found).toBe(true);
  });

  // SKIP le test CSV pour l'instant car l'endpoint n'existe pas
  it('should extract as csv and get the url of the file', async () => {
    console.log(`📊 Test d'extraction CSV pour l'utilisateur: ${userId}`);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/${userId}/extract`,
        {}, // Body vide car l'endpoint ne nécessite pas de données
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(`✅ Réponse d'extraction:`, response.data);

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('url');
      expect(response.data.url).toMatch(/^https?:\/\//); // Vérifier que c'est une URL valide
      expect(response.data.url).toContain('.csv'); // Vérifier que c'est un fichier CSV

      const url = response.data.url;
      console.log(`🔗 URL du fichier CSV: ${url}`);

      // Télécharger et vérifier le contenu du fichier CSV
      const fileResponse = await axios.get(url);
      expect(fileResponse.status).toBe(200);
      expect(fileResponse.headers['content-type']).toContain('text/csv');

      const csvContent = fileResponse.data;
      console.log(
        `📄 Contenu CSV (preview): ${csvContent.substring(0, 200)}...`,
      );

      // Vérifier les en-têtes CSV (format snake_case)
      expect(csvContent).toContain('reservation_id');
      expect(csvContent).toContain('user_id');
      expect(csvContent).toContain('room_id');
      expect(csvContent).toContain('start_time');
      expect(csvContent).toContain('end_time');
      expect(csvContent).toContain('status');
      expect(csvContent).toContain('location');
      expect(csvContent).toContain('created_at');

      // Vérifier que les données de la réservation créée sont présentes
      expect(csvContent).toContain(String(createdReservationId));
      expect(csvContent).toContain(String(userId));
      expect(csvContent).toContain(String(createdRoomId));

      // Parser le CSV pour vérifier la structure des données
      const fileStream = new Readable();
      fileStream.push(csvContent);
      fileStream.push(null);

      const results = [];

      await new Promise((resolve, reject) => {
        fileStream
          .pipe(csv())
          .on('data', (data) => {
            console.log(`📋 Ligne CSV parsée:`, data);
            results.push(data);
          })
          .on('end', () => {
            try {
              expect(results.length).toBeGreaterThan(0);

              // CORRECTION: Vérifier les propriétés au format snake_case (comme dans le CSV)
              expect(results[0]).toHaveProperty('reservation_id'); // au lieu de 'reservationId'
              expect(results[0]).toHaveProperty('user_id'); // au lieu de 'userId'
              expect(results[0]).toHaveProperty('room_id'); // au lieu de 'roomId'
              expect(results[0]).toHaveProperty('start_time'); // au lieu de 'startTime'
              expect(results[0]).toHaveProperty('end_time'); // au lieu de 'endTime'
              expect(results[0]).toHaveProperty('status');
              expect(results[0]).toHaveProperty('location');
              expect(results[0]).toHaveProperty('created_at'); // au lieu de 'createdAt'

              console.log(
                `✅ Structure CSV validée avec ${results.length} lignes`,
              );
              resolve();
            } catch (error) {
              reject(error);
            }
          })
          .on('error', (error) => {
            console.error(`❌ Erreur lors du parsing CSV:`, error);
            reject(error);
          });
      });

      console.log(`✅ Test d'extraction CSV réussi`);
    } catch (err) {
      console.error(
        `❌ Erreur lors du test d'extraction CSV:`,
        err.response?.data || err.message,
      );
      throw err;
    }
  });

  it('should delete the created reservation', async () => {
    const response = await axios.delete(
      `${BASE_URL}/api/reservations/${createdReservationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    expect(response.status).toBe(204);
  });

  it('should verify the reservation is deleted', async () => {
    try {
      await axios.get(`${BASE_URL}/api/reservations/${createdReservationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      throw new Error('Reservation was not deleted properly');
    } catch (error) {
      // L'API devrait renvoyer une 404 si la ressource n'existe plus
      if (error.response) {
        expect(error.response.status).toBe(404);
      } else {
        // Si pas de response, c'est probablement une erreur réseau
        throw error;
      }
    }
  });
});
