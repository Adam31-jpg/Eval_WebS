import { OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';
interface Room {
    id: string;
    name: string;
    capacity: string;
    location: string;
    created_at: string;
}
interface Empty {
}
interface Rooms {
    rooms: Room[];
}
export declare class RoomClient implements OnModuleInit {
    private roomService;
    private client;
    onModuleInit(): void;
    createRoom(room: Room): Observable<Room>;
    findAllRooms(): Observable<Rooms>;
    findOneRoom(id: string): Observable<Room>;
    updateRoom(id: string, room: Room): Observable<Room>;
    removeRoom(id: string): Observable<Empty>;
}
export {};
