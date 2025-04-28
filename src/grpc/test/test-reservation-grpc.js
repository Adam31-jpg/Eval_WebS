const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// -------------------------------------------------------------------
// 1. Charger le fichier .proto
// -------------------------------------------------------------------
// Adaptez le chemin vers votre fichier proto
const PROTO_PATH = path.join(__dirname, '../reservation/reservation.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false, // Changer en false pour utiliser camelCase
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// Charger le package reservation
const reservationPackage = protoDescriptor.reservation;

// -------------------------------------------------------------------
// 2. Créer un client gRPC vers le ReservationService
// -------------------------------------------------------------------
const client = new reservationPackage.ReservationService(
  'localhost:50051', // Utilisez le port sur lequel votre service est en écoute
  grpc.credentials.createInsecure(),
);

// -------------------------------------------------------------------
// 3. Fonctions utilitaires pour tester chaque opération CRUD
// -------------------------------------------------------------------

/**
 * Crée une réservation.
 */
function testCreateReservation(callback) {
  console.log('--- Testing Create Reservation ---');

  // Date actuelle + 1 jour pour début
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);
  startDate.setHours(10, 0, 0, 0);

  // Date de début + 2 heures pour fin
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 2);

  const request = {
    userId: 1,
    roomId: 1,
    location: `Salle de conférence ${Date.now() % 100}`,
    createdAt: new Date().toISOString(),
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
    status: 'PENDING',
  };

  client.Create(request, (err, response) => {
    console.log('Requête envoyée:', request);

    if (err) {
      console.error('Create erreur:', err.message);
      return callback(err);
    }
    console.log('Create réponse:', response);
    callback(null, response); // On transmet la réservation créée
  });
}

/**
 * Récupère une réservation par son ID.
 */
function testFindOneReservation(reservationId, callback) {
  console.log('--- Testing FindOne Reservation ---');
  const request = { id: reservationId };

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
 * Met à jour une réservation.
 */
function testUpdateReservation(reservation, callback) {
  console.log('--- Testing Update Reservation ---');
  // Mettons à jour le statut
  const updatedReservation = {
    ...reservation,
    status: 'APPROVED',
  };

  const request = {
    id: reservation.id,
    reservation: updatedReservation,
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
 * Supprime une réservation.
 */
function testRemoveReservation(reservationId, callback) {
  console.log('--- Testing Remove Reservation ---');
  const request = { id: reservationId };

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
 * Liste toutes les réservations.
 */
function testFindAllReservations(callback) {
  console.log('--- Testing FindAll Reservations ---');

  client.FindAll({}, (err, response) => {
    if (err) {
      console.error('FindAll erreur:', err.message);
      return callback(err);
    }
    console.log('FindAll réponse:', response);
    if (response && response.reservations) {
      console.log(`Nombre de réservations: ${response.reservations.length}`);
    }
    callback(null, response);
  });
}

// -------------------------------------------------------------------
// 4. Enchaîner les tests dans un "main" simple
// -------------------------------------------------------------------
function runAllTests() {
  console.log('=== Lancement des tests CRUD Reservation ===');

  // 1) Create
  testCreateReservation((err, createdReservation) => {
    if (err) return console.error('Echec testCreateReservation', err);

    // 2) FindOne
    testFindOneReservation(createdReservation.id, (err, fetchedReservation) => {
      if (err) return console.error('Echec testFindOneReservation', err);

      // 3) Update
      testUpdateReservation(fetchedReservation, (err, updatedReservation) => {
        if (err) return console.error('Echec testUpdateReservation', err);

        // 4) FindAll
        testFindAllReservations((err) => {
          if (err) return console.error('Echec testFindAllReservations', err);

          // 5) Remove
          testRemoveReservation(updatedReservation.id, (err) => {
            if (err) return console.error('Echec testRemoveReservation', err);

            console.log('=== Fin des tests CRUD Reservation ===');
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
// testFindAllReservations((err) => {
//   if(err) console.error(err);
//   process.exit(0);
// });
