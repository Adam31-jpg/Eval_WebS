require('dotenv').config();
const axios = require('axios');
const { getToken } = require('../setup');
const { graphqlRequest } = require('../utils/graphql.utils');

describe('Rooms E2E Tests', () => {
  let token;
  let createdRoomId;

  beforeAll(async () => {
    // Récupère le token Keycloak initialisé par setupKeycloak.js
    token = getToken();
    console.log(
      '🔑 Token utilisé dans les tests:',
      token ? `${token.substring(0, 20)}...` : 'AUCUN TOKEN',
    );

    if (!token) {
      throw new Error('Aucun token disponible pour les tests');
    }
  });

  it('should create a new room', async () => {
    const mutation = `
            mutation CreateRoom($name: String!, $capacity: Int!, $location: String!) {
                createRoom(name: $name, capacity: $capacity, location: $location) {
                    id
                    name
                    capacity
                    location
                }
            }
        `;

    const variables = {
      name: 'Salle Test',
      capacity: 15,
      location: 'Bâtiment A',
    };

    const data = await graphqlRequest(mutation, variables, token);

    // Vérifie la réponse
    expect(data.createRoom).toBeDefined();
    expect(data.createRoom.id).toBeDefined();
    expect(data.createRoom.name).toBe(variables.name);
    expect(data.createRoom.capacity).toBe(variables.capacity);
    expect(data.createRoom.location).toBe(variables.location);

    // On stocke l'ID pour la suite des tests
    createdRoomId = data.createRoom.id;
    console.log('✅ Room créée avec ID:', createdRoomId);
  });

  it('should get the created room by ID', async () => {
    const query = `
            query Room($id: ID!) {
                room(id: $id) {
                    id
                    name
                    capacity
                    location
                }
            }
        `;

    // CORRECTION: Passer l'ID dans les variables au lieu d'un objet vide
    const variables = { id: createdRoomId };

    const data = await graphqlRequest(query, variables, token);

    expect(data.room).toBeDefined();
    expect(data.room.id).toBe(createdRoomId);
    expect(data.room.name).toBe('Salle Test');
    expect(data.room.capacity).toBe(15);
    expect(data.room.location).toBe('Bâtiment A');
  });

  it('should update the room', async () => {
    const mutation = `
            mutation UpdateRoom($id: ID!, $name: String, $capacity: Int, $location: String) {
                updateRoom(id: $id, name: $name, capacity: $capacity, location: $location) {
                    id
                    name
                    capacity
                    location
                }
            }
        `;

    // CORRECTION: Passer l'ID et les données à mettre à jour
    const variables = {
      id: createdRoomId,
      name: 'Nouvelle Salle Test',
      capacity: 20,
      location: 'Bâtiment B',
    };

    const data = await graphqlRequest(mutation, variables, token);

    expect(data.updateRoom).toBeDefined();
    expect(data.updateRoom.id).toBe(createdRoomId);
    expect(data.updateRoom.name).toBe(variables.name);
    expect(data.updateRoom.capacity).toBe(variables.capacity);
    expect(data.updateRoom.location).toBe(variables.location);
  });

  it('should list rooms (with pagination)', async () => {
    const query = `
            query ListRooms($skip: Int, $limit: Int) {
                listRooms(skip: $skip, limit: $limit) {
                    id
                    name
                    capacity
                    location
                }
            }
        `;

    // CORRECTION: Passer les paramètres de pagination
    const variables = {
      skip: 0,
      limit: 10,
    };

    const data = await graphqlRequest(query, variables, token);

    expect(Array.isArray(data.listRooms)).toBe(true);
    expect(data.listRooms.length).toBeGreaterThan(0);

    // On s'attend à trouver la salle récemment créée/déjà mise à jour
    const found = data.listRooms.find((r) => r.id === createdRoomId);
    expect(found).toBeDefined();
    expect(found.name).toBe('Nouvelle Salle Test');
    expect(found.capacity).toBe(20);
    expect(found.location).toBe('Bâtiment B');
  });

  it('should delete the created room', async () => {
    const mutation = `
            mutation DeleteRoom($id: ID!) {
                deleteRoom(id: $id)
            }
        `;

    // CORRECTION: Passer l'ID dans les variables
    const variables = { id: createdRoomId };

    const data = await graphqlRequest(mutation, variables, token);

    expect(data.deleteRoom).toBe(true);
  });

  it('should verify the room is deleted', async () => {
    const query = `
            query Room($id: ID!) {
                room(id: $id) {
                    id
                    name
                }
            }
        `;

    // CORRECTION: Passer l'ID dans les variables
    const variables = { id: createdRoomId };

    const data = await graphqlRequest(query, variables, token);

    // On s'attend à ce que la room n'existe plus => room == null
    expect(data.room).toBeNull();
  });
});
