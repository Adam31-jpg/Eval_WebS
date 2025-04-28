const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// -------------------------------------------------------------------
// 1. Charger le fichier .proto
// -------------------------------------------------------------------
// Adaptez le chemin vers votre fichier proto
const PROTO_PATH = path.join(__dirname, '../notification/notification.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// Charger le package notification
const notificationPackage = protoDescriptor.notification;

// -------------------------------------------------------------------
// 2. Créer un client gRPC vers le NotificationService
// -------------------------------------------------------------------
const client = new notificationPackage.NotificationService(
  'localhost:50051',
  grpc.credentials.createInsecure(),
);

// -------------------------------------------------------------------
// 3. Fonctions utilitaires pour tester chaque opération CRUD
// -------------------------------------------------------------------

/**
 * Crée une notification.
 */
function testCreateNotification(callback) {
  console.log('--- Testing Create Notification ---');
  const request = {
    reservationId: 123,
    message: 'Votre réservation est confirmée',
    notificationDate: new Date().toISOString(),
    isSent: false,
  };

  client.Create(request, (err, response) => {
    console.log('Requête envoyée:', request);

    if (err) {
      console.error('Create erreur:', err.message);
      return callback(err);
    }
    console.log('Create réponse:', response);
    callback(null, response); // On transmet la notification créée
  });
}

/**
 * Récupère une notification par son ID.
 */
function testFindOneNotification(notificationId, callback) {
  console.log('--- Testing FindOne Notification ---');
  const request = { id: notificationId };

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
 * Met à jour une notification.
 */
function testUpdateNotification(notification, callback) {
  console.log('--- Testing Update Notification ---');
  // Mettons à jour le message et le statut
  const updatedNotification = {
    ...notification,
    message: 'Message mis à jour: ' + new Date().toLocaleTimeString(),
    isSent: true,
  };

  const request = {
    id: notification.id,
    notification: updatedNotification,
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
 * Supprime une notification.
 */
function testRemoveNotification(notificationId, callback) {
  console.log('--- Testing Remove Notification ---');
  const request = { id: notificationId };

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
 * Liste toutes les notifications.
 */
function testFindAllNotifications(callback) {
  console.log('--- Testing FindAll Notifications ---');

  client.FindAll({}, (err, response) => {
    if (err) {
      console.error('FindAll erreur:', err.message);
      return callback(err);
    }
    console.log('FindAll réponse:', response);
    if (response && response.notifications) {
      console.log(`Nombre de notifications: ${response.notifications.length}`);
    }
    callback(null, response);
  });
}

// -------------------------------------------------------------------
// 4. Enchaîner les tests dans un "main" simple
// -------------------------------------------------------------------
function runAllTests() {
  console.log('=== Lancement des tests CRUD Notification ===');

  // 1) Create
  testCreateNotification((err, createdNotification) => {
    if (err) return console.error('Echec testCreateNotification', err);

    // 2) FindOne
    testFindOneNotification(
      createdNotification.id,
      (err, fetchedNotification) => {
        if (err) return console.error('Echec testFindOneNotification', err);

        // 3) Update
        testUpdateNotification(
          fetchedNotification,
          (err, updatedNotification) => {
            if (err) return console.error('Echec testUpdateNotification', err);

            // 4) FindAll
            testFindAllNotifications((err) => {
              if (err)
                return console.error('Echec testFindAllNotifications', err);

              // 5) Remove
              testRemoveNotification(updatedNotification.id, (err) => {
                if (err)
                  return console.error('Echec testRemoveNotification', err);

                console.log('=== Fin des tests CRUD Notification ===');
                process.exit(0);
              });
            });
          },
        );
      },
    );
  });
}

// -------------------------------------------------------------------
// 5. Lancer le script
// -------------------------------------------------------------------
runAllTests();

// Pour tester juste une fonction spécifique, décommentez ci-dessous:
// testFindAllNotifications((err) => {
//   if(err) console.error(err);
//   process.exit(0);
// });
