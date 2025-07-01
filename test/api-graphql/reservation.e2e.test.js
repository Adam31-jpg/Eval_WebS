const axios = require('axios');
const { getToken } = require('../setup');
const { createRoom } = require('../utils/room.utils');
const { getPool, closePool } = require('../utils/db.utils');
const { graphqlRequest } = require('../utils/graphql.utils');

const API_REST_URL = process.env.API_REST_URL || 'http://localhost:3000';

describe('Reservations E2E Tests', () => {
  let token;
  let createdRoomId;
  let userId;
  let createdReservationId;

  beforeAll(async () => {
    token = getToken();
    console.log(
      '🔑 Token récupéré:',
      token ? `${token.substring(0, 20)}...` : 'AUCUN TOKEN',
    );

    try {
      // 1. Créer une salle via l'API REST
      const roomRes = await createRoom({
        base_url: API_REST_URL,
        room: {
          name: 'Meeting Room #1',
          capacity: 10,
          location: '2nd Floor',
        },
        token,
      });
      createdRoomId = roomRes.data.id;
      console.log('✅ Salle créée avec ID:', createdRoomId);

      // 2. Récupérer un user existant via l'API REST
      const responseUsers = await axios.get(`${API_REST_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('📊 Réponse users:', responseUsers.data);

      // CORRECTION: Gérer la structure de réponse des users
      const users = responseUsers.data.users || responseUsers.data;

      if (!users || users.length === 0) {
        throw new Error('No user found');
      }

      userId = users[0].id;
      console.log('✅ User trouvé avec ID:', userId);
    } catch (error) {
      console.error('❌ Erreur dans beforeAll:', error.message);
      throw error;
    }
  });

  it('should create a reservation using the created room', async () => {
    // CORRECTION: Utiliser la mutation createReservation (sans @Mutation manquant)
    const mutation = `
            mutation CreateReservation($userId: Int!, $roomId: Int!, $startTime: String!, $endTime: String!) {
                createReservation(userId: $userId, roomId: $roomId, startTime: $startTime, endTime: $endTime) {
                    id
                    userId
                    roomId
                    startTime
                    endTime
                }
            }
        `;

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const variables = {
      userId: parseInt(userId, 10),
      roomId: parseInt(createdRoomId, 10),
      startTime: now.toISOString(),
      endTime: oneHourLater.toISOString(),
    };

    console.log('📊 Variables pour createReservation:', variables);

    const data = await graphqlRequest(mutation, variables, token);

    expect(data.createReservation).toBeDefined();
    expect(data.createReservation.id).toBeDefined();
    expect(data.createReservation.userId).toBe(userId.toString()); // Comparaison en string
    expect(data.createReservation.roomId).toBe(createdRoomId.toString()); // Comparaison en string

    createdReservationId = data.createReservation.id;
    console.log('✅ Réservation créée avec ID:', createdReservationId);
  });

  it('should get the created reservation by ID in database', async () => {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT * FROM reservations WHERE id = $1`,
      [createdReservationId],
    );
    expect(rows.length).toBe(1);
    expect(rows[0].user_id || rows[0].userId).toBe(parseInt(userId, 10));
    expect(rows[0].room_id || rows[0].roomId).toBe(parseInt(createdRoomId, 10));
    await closePool();
  });

  it('should find a notification in table notifications with this reservation id', async () => {
    // CORRECTION: Attendre un peu que la notification gRPC soit créée
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT * FROM notifications WHERE "reservation_id" = $1`,
      [createdReservationId],
    );

    console.log('🔍 Notifications trouvées:', rows.length);
    if (rows.length > 0) {
      console.log('📧 Message de notification:', rows[0].message);
    }

    expect(rows.length).toBe(1);
    expect(rows[0].message).toContain('Nouvelle réservation GraphQL');
    console.log(
      '✅ Notification gRPC trouvée pour la réservation:',
      createdReservationId,
    );
    await closePool();
  });

  it('should get the created reservation by ID', async () => {
    const query = `
            query Reservation($id: ID!) {
                reservation(id: $id) {
                    id
                    userId
                    roomId
                    startTime
                    endTime
                }
            }
        `;

    const variables = { id: createdReservationId };
    const data = await graphqlRequest(query, variables, token);

    expect(data.reservation).toBeDefined();
    expect(data.reservation.id).toBe(createdReservationId);
    expect(data.reservation.userId).toBe(userId.toString());
    expect(data.reservation.roomId).toBe(createdRoomId.toString());
  });

  it('should update the reservation times', async () => {
    const mutation = `
            mutation UpdateReservation($id: ID!, $startTime: String, $endTime: String) {
                updateReservation(id: $id, startTime: $startTime, endTime: $endTime) {
                    id
                    userId
                    roomId
                    startTime
                    endTime
                }
            }
        `;

    const newStart = new Date();
    newStart.setHours(newStart.getHours() + 2);
    const newEnd = new Date(newStart.getTime() + 60 * 60 * 1000);

    const variables = {
      id: createdReservationId,
      startTime: newStart.toISOString(),
      endTime: newEnd.toISOString(),
    };

    const data = await graphqlRequest(mutation, variables, token);

    expect(data.updateReservation).toBeDefined();
    expect(data.updateReservation.id).toBe(createdReservationId);
    // CORRECTION: Vérifier que les dates sont maintenant en format ISO
    expect(data.updateReservation.startTime).toBe(newStart.toISOString());
    expect(data.updateReservation.endTime).toBe(newEnd.toISOString());
    console.log('✅ Réservation mise à jour avec dates formatées correctement');
  });

  it('should list reservations (with pagination)', async () => {
    const query = `
            query ListReservations($skip: Int, $limit: Int) {
                listReservations(skip: $skip, limit: $limit) {
                    id
                    userId
                    roomId
                    startTime
                    endTime
                }
            }
        `;

    const variables = { skip: 0, limit: 10 };
    const data = await graphqlRequest(query, variables, token);

    expect(Array.isArray(data.listReservations)).toBe(true);
    expect(data.listReservations.length).toBeGreaterThan(0);

    const found = data.listReservations.find(
      (r) => r.id === createdReservationId,
    );
    expect(found).toBeDefined();
    expect(found.userId).toBe(userId.toString());
    expect(found.roomId).toBe(createdRoomId.toString());
  });

  it('should delete the created reservation', async () => {
    const mutation = `
            mutation DeleteReservation($id: ID!) {
                deleteReservation(id: $id)
            }
        `;

    const variables = { id: createdReservationId };
    const data = await graphqlRequest(mutation, variables, token);

    expect(data.deleteReservation).toBe(true);
  });

  it('should verify the reservation is deleted', async () => {
    const query = `
            query Reservation($id: ID!) {
                reservation(id: $id) {
                    id
                }
            }
        `;

    const variables = { id: createdReservationId };

    try {
      const data = await graphqlRequest(query, variables, token);
      // Si la réservation service retourne null au lieu de lever une exception
      expect(data.reservation).toBeNull();
    } catch (error) {
      // Si le service lève une NotFoundException comme pour les rooms
      expect(error.message).toContain('Not Found');
      console.log(
        '✅ Réservation correctement supprimée (NotFoundException attendue)',
      );
    }
  });
});
