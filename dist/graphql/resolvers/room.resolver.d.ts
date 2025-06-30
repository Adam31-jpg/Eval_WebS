import { RoomEntity } from '../../entities/room.entity';
import { ReservationType } from './reservation.resolver';
import { Observable } from 'rxjs';
import { CreateRoomInput } from './dto/create-room.input';
import { RoomService } from '../services/room.service';
export declare class RoomType {
    id: string;
    name: string;
    capacity: string;
    location: string;
    created_at: string;
    reservations: ReservationType[];
}
export declare class RoomResolver {
    private readonly roomService;
    constructor(roomService: RoomService);
    listRooms(skip: number, limit: number): Observable<RoomEntity[]>;
    room(id: string): Observable<RoomEntity>;
    createRoom(input: CreateRoomInput): Observable<RoomEntity>;
    updateRoom(id: string, input: CreateRoomInput): Observable<RoomEntity>;
    deleteRoom(id: string): Observable<boolean>;
}
