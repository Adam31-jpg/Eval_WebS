const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// -------------------------------------------------------------------
// 1. Charger le fichier .proto
// -------------------------------------------------------------------
const PROTO_PATH = path.join(
  '/Users/adam/Documents/M2-DEV-WEB/WebServices/Eval_WebS/src/grpc/notification/notification.proto',
);
// Adaptez le chemin si nécessaire

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// On suppose que dans university.proto :
//   package university;
//   service StudentService { ... }
const universityPackage = protoDescriptor.notification;

// -------------------------------------------------------------------
// 2. Créer un client gRPC vers le StudentService
// -------------------------------------------------------------------
const client = new universityPackage.NotificationService(
  'localhost:50051', // Adaptez si le service écoute ailleurs
  grpc.credentials.createInsecure(),
);

// -------------------------------------------------------------------
// 3. Fonctions utilitaires pour tester chaque opération CRUD
// -------------------------------------------------------------------

/**
 * Crée un étudiant.
 * On suppose la méthode : rpc CreateStudent (CreateStudentRequest) returns (StudentResponse);
 */
function testCreateStudent(callback) {
  console.log('--- Testing CreateStudent ---');
  const request = {
    reservationId: 23000,
    message: 'Nouvelle réservation créée pour la chambre 2',
    notificationDate: '2025-03-18T15:06:09.435Z',
    isSent: false,
  };

  client.Create(request, (err, response) => {
    console.log(request);

    if (err) {
      console.error('CreateStudent erreur:', err.message);
      return callback(err);
    }
    console.log('CreateStudent réponse:', response);

    if (response && response.student && response.student.id) {
      console.log(`Student créé avec l'ID: ${response.student.id}`);
    } else {
      console.warn("Réponse inattendue lors de la création d'un étudiant");
    }
    callback(null, response.student); // On transmet l'objet Student créé
  });
}

/**
 * Récupère un étudiant par son ID.
 * On suppose la méthode : rpc GetStudent (GetStudentRequest) returns (StudentResponse);
 */
function testGetStudent(studentId, callback) {
  console.log('--- Testing GetStudent ---');
  const request = { id: studentId };

  client.GetStudent(request, (err, response) => {
    if (err) {
      console.error('GetStudent erreur:', err.message);
      return callback(err);
    }
    console.log('GetStudent réponse:', response);
    callback(null, response.student);
  });
}

/**
 * Met à jour un étudiant.
 * On suppose la méthode : rpc UpdateStudent (UpdateStudentRequest) returns (StudentResponse);
 */
function testUpdateStudent(student, callback) {
  console.log('--- Testing UpdateStudent ---');
  // Mettons à jour par exemple le firstName et l'email
  const request = {
    id: student.id,
    firstName: 'Jane',
    lastName: student.lastName,
    email: Math.random() + '@example.com',
    password: student.password,
  };

  client.UpdateStudent(request, (err, response) => {
    if (err) {
      console.error('UpdateStudent erreur:', err.message);
      return callback(err);
    }
    console.log('UpdateStudent réponse:', response);
    callback(null, response.student);
  });
}

/**
 * Supprime un étudiant.
 * On suppose la méthode : rpc DeleteStudent (DeleteStudentRequest) returns (Empty);
 */
function testDeleteStudent(studentId, callback) {
  console.log('--- Testing DeleteStudent ---');
  const request = { id: studentId };

  client.DeleteStudent(request, (err, response) => {
    console.log(err);
    console.log(response);
    if (err) {
      // console.error('DeleteStudent erreur:', err.message);
      // return callback(err);
    }
    console.log('DeleteStudent réponse:', response);
    callback(null, null);
  });
}

/**
 * Liste tous les étudiants.
 * On suppose la méthode : rpc ListStudents (ListStudentsRequest) returns (ListStudentsResponse);
 */
function testListStudents(callback) {
  console.log('--- Testing ListStudents ---');

  client.ListStudents(
    {
      skip: 0,
      limit: 10,
    },
    (err, response) => {
      if (err) {
        console.error('ListStudents erreur:', err.message);
        return callback(err);
      }
      console.log('ListStudents réponse:', response);
      if (response && response.students) {
        console.log(`Nombre d'étudiants: ${response.students.length}`);
      }
      callback(null, response.students);
    },
  );
}

// -------------------------------------------------------------------
// 4. Enchaîner les tests dans un "main" simple
// -------------------------------------------------------------------
function runAllTests() {
  console.log('=== Lancement des tests CRUD Student ===');
  // 1) Create
  testCreateStudent((err, createdStudent) => {
    if (err) return console.error('Echec testCreateStudent', err);

    // 2) Get
    testGetStudent(createdStudent.id, (err, fetchedStudent) => {
      if (err) return console.error('Echec testGetStudent', err);

      // 3) Update
      testUpdateStudent(fetchedStudent, (err, updatedStudent) => {
        if (err) return console.error('Echec testUpdateStudent', err);

        // 4) Delete
        testDeleteStudent(updatedStudent.id, (err) => {
          if (err) return console.error('Echec testDeleteStudent', err);

          // 5) List
          testListStudents((err) => {
            if (err) return console.error('Echec testListStudents', err);

            console.log('=== Fin des tests CRUD Student ===');
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

// testListStudents((err) => {
//   if(err) console.error(err)
// })
