"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path_1 = require("path");
const PROTO_PATH = (0, path_1.join)(__dirname, '../room/room.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const roomsProto = grpc.loadPackageDefinition(packageDefinition);
const client = new roomsProto.room.RoomService('localhost:50051', grpc.credentials.createInsecure());
function promisify(fn) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            fn(...args, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response);
            });
        });
    };
}
async function createRoom() {
    const data = {
        name: 'Suite Deluxe',
        capacity: '4',
        location: 'Aile Ouest, 2ème étage',
        created_at: new Date().toISOString(),
    };
    const createRoomPromise = promisify(client.Create.bind(client));
    const response = await createRoomPromise(data);
    console.log('Created room:', response);
    return response;
}
async function getRoom(id) {
    const getRoomPromise = promisify(client.FindOne.bind(client));
    const response = await getRoomPromise({ id });
    console.log('Retrieved room:', response);
    return response;
}
async function getAllRooms() {
    const getAllRoomsPromise = promisify(client.FindAll.bind(client));
    const response = await getAllRoomsPromise({});
    console.log('All rooms:', response);
    return response;
}
async function updateRoom(id) {
    const data = {
        id,
        room: {
            name: 'Suite Royale Mise à Jour',
            capacity: '5',
            location: 'Aile Est, Étage Premium',
        },
    };
    const updateRoomPromise = promisify(client.Update.bind(client));
    const response = await updateRoomPromise(data);
    console.log('Updated room:', response);
    return response;
}
async function deleteRoom(id) {
    const deleteRoomPromise = promisify(client.Remove.bind(client));
    const response = await deleteRoomPromise({ id });
    console.log('Room deleted, response:', response);
    return response;
}
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
    }
    catch (error) {
        console.error('Error during tests:', error);
    }
}
runTests().catch(console.error);
//# sourceMappingURL=grpc-client.js.map