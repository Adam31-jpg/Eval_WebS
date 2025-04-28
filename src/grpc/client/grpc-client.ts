import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';

const PROTO_PATH = join(__dirname, '../room/room.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const roomsProto = grpc.loadPackageDefinition(packageDefinition);

const client = new (roomsProto as any).room.RoomService(
  'localhost:50051',
  grpc.credentials.createInsecure(),
);

// Définir une interface pour la réponse Room
interface Room {
  id: string;
  name: string;
  capacity: string;
  location: string;
  created_at: string;
}

// Fonction utilitaire pour promisifier les appels gRPC
function promisify<T>(fn: Function): (...args: any[]) => Promise<T> {
  return (...args: any[]): Promise<T> => {
    return new Promise((resolve, reject) => {
      fn(...args, (error: any, response: T) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response);
      });
    });
  };
}

// Fonction pour créer une chambre
async function createRoom(): Promise<Room> {
  const data = {
    name: 'Suite Deluxe',
    capacity: '4',
    location: 'Aile Ouest, 2ème étage',
    created_at: new Date().toISOString(),
  };

  const createRoomPromise = promisify<Room>(client.Create.bind(client));
  const response = await createRoomPromise(data);
  console.log('Created room:', response);
  return response;
}

// Fonction pour récupérer une chambre
async function getRoom(id: string): Promise<Room> {
  const getRoomPromise = promisify<Room>(client.FindOne.bind(client));
  const response = await getRoomPromise({ id });
  console.log('Retrieved room:', response);
  return response;
}

// Fonction pour récupérer toutes les chambres
async function getAllRooms() {
  const getAllRoomsPromise = promisify(client.FindAll.bind(client));
  const response = await getAllRoomsPromise({});
  console.log('All rooms:', response);
  return response;
}

// Fonction pour mettre à jour une chambre
async function updateRoom(id: string): Promise<Room> {
  const data = {
    id,
    room: {
      name: 'Suite Royale Mise à Jour',
      capacity: '5',
      location: 'Aile Est, Étage Premium',
    },
  };

  const updateRoomPromise = promisify<Room>(client.Update.bind(client));
  const response = await updateRoomPromise(data);
  console.log('Updated room:', response);
  return response;
}

// Fonction pour supprimer une chambre
async function deleteRoom(id: string) {
  const deleteRoomPromise = promisify(client.Remove.bind(client));
  const response = await deleteRoomPromise({ id });
  console.log('Room deleted, response:', response);
  return response;
}

// Exécuter les tests
async function runTests() {
  try {
    console.log('Getting all rooms initially...');
    await getAllRooms();

    console.log('\nCreating new room...');
    const createdRoom = await createRoom();
    const roomId = createdRoom.id;

    console.log(`\nGetting room with ID ${roomId}...`);
    await getRoom(roomId);

    console.log(`\nUpdating room with ID ${roomId}...`);
    await updateRoom(roomId);

    console.log(`\nGetting room after update with ID ${roomId}...`);
    await getRoom(roomId);

    console.log(`\nDeleting room with ID ${roomId}...`);
    await deleteRoom(roomId);

    console.log('\nGetting all rooms after deletion...');
    await getAllRooms();
  } catch (error) {
    console.error('Error during tests:', error);
  }
}

runTests().catch(console.error);
