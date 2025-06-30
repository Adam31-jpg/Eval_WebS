import { Repository } from 'typeorm';
import { RoomEntity } from '../../entities/room.entity';
import { Observable } from 'rxjs';
import { CreateRoomInput } from '../resolvers/dto/create-room.input';
export declare class RoomService {
    private readonly roomRepository;
    constructor(roomRepository: Repository<RoomEntity>);
    listRooms(skip: number, limit: number): Observable<RoomEntity[]>;
    room(id: string): Observable<RoomEntity>;
    createRoom(room: CreateRoomInput): Observable<RoomEntity>;
    updateRoom(id: string, input: CreateRoomInput): Observable<RoomEntity>;
    deleteRoom(id: string): Observable<boolean>;
}
