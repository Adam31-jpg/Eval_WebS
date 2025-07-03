const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// -------------------------------------------------------------------
// 1. Charger le fichier .proto
// -------------------------------------------------------------------
// Adaptez le chemin vers votre fichier proto
const PROTO_PATH = path.join(__dirname, '../user/user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// Charger le package user
const userPackage = protoDescriptor.user;

// -------------------------------------------------------------------
// 2. Créer un client gRPC vers le UserService
// -------------------------------------------------------------------
const client = new userPackage.UserService(
  'localhost:50051', // Utilisez le port sur lequel votre service est en écoute
  grpc.credentials.createInsecure(),
);

// -------------------------------------------------------------------
// 3. Fonctions utilitaires pour tester chaque opération CRUD
// -------------------------------------------------------------------

/**
 * Crée un utilisateur.
 */
function testCreateUser(callback) {
  console.log('--- Testing Create User ---');
  const request = {
    keycloak_id: 'kc_' + Date.now(),
    email: `user_${Date.now()}@example.com`,
    created_at: new Date().toISOString(),
  };

  client.Create(request, (err, response) => {
    console.log('Requête envoyée:', request);

    if (err) {
      console.error('Create erreur:', err.message);
      return callback(err);
    }
    console.log('Create réponse:', response);
    callback(null, response); // On transmet l'utilisateur créé
  });
}

/**
 * Récupère un utilisateur par son ID.
 */
function testFindOneUser(userId, callback) {
  console.log('--- Testing FindOne User ---');
  const request = { id: userId };

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
 * Met à jour un utilisateur.
 */
function testUpdateUser(user, callback) {
  console.log('--- Testing Update User ---');
  // Mettons à jour l'email
  const updatedUser = {
    ...user,
    email: `updated_${Date.now()}@example.com`,
  };

  const request = {
    id: user.id,
    user: updatedUser,
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
 * Supprime un utilisateur.
 */
function testRemoveUser(userId, callback) {
  console.log('--- Testing Remove User ---');
  const request = { id: userId };

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
 * Liste tous les utilisateurs.
 */
function testFindAllUsers(callback) {
  console.log('--- Testing FindAll Users ---');

  client.FindAll({}, (err, response) => {
    if (err) {
      console.error('FindAll erreur:', err.message);
      return callback(err);
    }
    console.log('FindAll réponse:', response);
    if (response && response.users) {
      console.log(`Nombre d'utilisateurs: ${response.users.length}`);
    }
    callback(null, response);
  });
}

// -------------------------------------------------------------------
// 4. Enchaîner les tests dans un "main" simple
// -------------------------------------------------------------------
function runAllTests() {
  console.log('=== Lancement des tests CRUD User ===');

  // 1) Create
  testCreateUser((err, createdUser) => {
    if (err) return console.error('Echec testCreateUser', err);

    // 2) FindOne
    testFindOneUser(createdUser.id, (err, fetchedUser) => {
      if (err) return console.error('Echec testFindOneUser', err);

      // 3) Update
      testUpdateUser(fetchedUser, (err, updatedUser) => {
        if (err) return console.error('Echec testUpdateUser', err);

        // 4) FindAll
        testFindAllUsers((err) => {
          if (err) return console.error('Echec testFindAllUsers', err);

          // 5) Remove
          testRemoveUser(updatedUser.id, (err) => {
            if (err) return console.error('Echec testRemoveUser', err);

            console.log('=== Fin des tests CRUD User ===');
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
// testFindAllUsers((err) => {
//   if(err) console.error(err);
//   process.exit(0);
// });
