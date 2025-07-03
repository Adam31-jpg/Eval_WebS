import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Observable } from 'rxjs';

// Interfaces correspondant aux messages du proto
interface Room {
    id: string;
    name: string;
    capacity: string;
    location: string;
    created_at: string;
}

interface Empty { }

interface RoomById {
    id: string;
}

interface UpdateRoomRequest {
    id: string;
    room: Room;
}

interface Rooms {
    rooms: Room[];
}

// Interface du service correspondant aux méthodes rpc
interface RoomService {
    Create(data: Room): Observable<Room>;
    FindAll(empty: Empty): Observable<Rooms>;
    FindOne(data: RoomById): Observable<Room>;
    Update(data: UpdateRoomRequest): Observable<Room>;
    Remove(data: RoomById): Observable<Empty>;
}

@Injectable()
export class RoomClient implements OnModuleInit {
    private roomService: RoomService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'room',
            protoPath: join(__dirname, './room.proto'),
            url: 'localhost:50053', // Ajustez le port selon votre configuration
        },
    })
    private client: ClientGrpc;

    onModuleInit() {
        this.roomService = this.client.getService<RoomService>('RoomService');
    }

    createRoom(room: Room): Observable<Room> {
        return this.roomService.Create(room);
    }

    findAllRooms(): Observable<Rooms> {
        return this.roomService.FindAll({});
    }

    findOneRoom(id: string): Observable<Room> {
        return this.roomService.FindOne({ id });
    }

    updateRoom(id: string, room: Room): Observable<Room> {
        return this.roomService.Update({ id, room });
    }

    removeRoom(id: string): Observable<Empty> {
        return this.roomService.Remove({ id });
    }
}