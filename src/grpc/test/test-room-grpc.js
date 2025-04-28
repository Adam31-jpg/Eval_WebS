const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// -------------------------------------------------------------------
// 1. Charger le fichier .proto
// -------------------------------------------------------------------
// Adaptez le chemin vers votre fichier proto
const PROTO_PATH = path.join(__dirname, '../room/room.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false, // Changer en false pour utiliser camelCase
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// Charger le package room
const roomPackage = protoDescriptor.room;

// -------------------------------------------------------------------
// 2. Créer un client gRPC vers le RoomService
// -------------------------------------------------------------------
const client = new roomPackage.RoomService(
  'localhost:50051', // Utilisez le port sur lequel votre service est en écoute
  grpc.credentials.createInsecure(),
);

// -------------------------------------------------------------------
// 3. Fonctions utilitaires pour tester chaque opération CRUD
// -------------------------------------------------------------------

/**
 * Crée une salle.
 */
function testCreateRoom(callback) {
  console.log('--- Testing Create Room ---');
  const request = {
    name: `Salle ${Date.now() % 1000}`,
    capacity: '20',
    location: `Bâtiment ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}, Étage ${Math.floor(Math.random() * 5) + 1}`,
    createdAt: new Date().toISOString(),
  };

  client.Create(request, (err, response) => {
    console.log('Requête envoyée:', request);

    if (err) {
      console.error('Create erreur:', err.message);
      return callback(err);
    }
    console.log('Create réponse:', response);
    callback(null, response); // On transmet la salle créée
  });
}

/**
 * Récupère une salle par son ID.
 */
function testFindOneRoom(roomId, callback) {
  console.log('--- Testing FindOne Room ---');
  const request = { id: roomId };

  client.FindOne(request, (err, response) => {
    if (err) {
      console.error('FindOne erreur:', err.message);
      return callback(err);
    }
    console.log('FindOne réponse:', response);
    callback(null, response);
  });
}

/**
 * Met à jour une salle.
 */
function testUpdateRoom(room, callback) {
  console.log('--- Testing Update Room ---');
  // Mettons à jour le nom et la capacité
  const updatedRoom = {
    ...room,
    name: `${room.name} - Mise à jour`,
    capacity: String(parseInt(room.capacity) + 5),
  };

  const request = {
    id: room.id,
    room: updatedRoom,
  };

  client.Update(request, (err, response) => {
    if (err) {
      console.error('Update erreur:', err.message);
      return callback(err);
    }
    console.log('Update réponse:', response);
    callback(null, response);
  });
}

/**
 * Supprime une salle.
 */
function testRemoveRoom(roomId, callback) {
  console.log('--- Testing Remove Room ---');
  const request = { id: roomId };

  client.Remove(request, (err, response) => {
    if (err) {
      console.error('Remove erreur:', err.message);
      return callback(err);
    }
    console.log('Remove réponse:', response);
    callback(null, response);
  });
}

/**
 * Liste toutes les salles.
 */
function testFindAllRooms(callback) {
  console.log('--- Testing FindAll Rooms ---');

  client.FindAll({}, (err, response) => {
    if (err) {
      console.error('FindAll erreur:', err.message);
      return callback(err);
    }
    console.log('FindAll réponse:', response);
    if (response && response.rooms) {
      console.log(`Nombre de salles: ${response.rooms.length}`);
    }
    callback(null, response);
  });
}

// -------------------------------------------------------------------
// 4. Enchaîner les tests dans un "main" simple
// -------------------------------------------------------------------
function runAllTests() {
  console.log('=== Lancement des tests CRUD Room ===');

  // 1) Create
  testCreateRoom((err, createdRoom) => {
    if (err) return console.error('Echec testCreateRoom', err);

    // 2) FindOne
    testFindOneRoom(createdRoom.id, (err, fetchedRoom) => {
      if (err) return console.error('Echec testFindOneRoom', err);

      // 3) Update
      testUpdateRoom(fetchedRoom, (err, updatedRoom) => {
        if (err) return console.error('Echec testUpdateRoom', err);

        // 4) FindAll
        testFindAllRooms((err) => {
          if (err) return console.error('Echec testFindAllRooms', err);

          // 5) Remove
          testRemoveRoom(updatedRoom.id, (err) => {
            if (err) return console.error('Echec testRemoveRoom', err);

            console.log('=== Fin des tests CRUD Room ===');
            process.exit(0);
          });
        });
      });
    });
  });
}

// -------------------------------------------------------------------
// 5. Lancer le script
// -------------------------------------------------------------------
runAllTests();

// Pour tester juste une fonction spécifique, décommentez ci-dessous:
// testFindAllRooms((err) => {
//   if(err) console.error(err);
//   process.exit(0);
// });
