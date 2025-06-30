import { RoomEntity } from 'src/entities/room.entity';
import { RoomService } from './room.service';
export declare class RoomController {
    private readonly roomService;
    constructor(roomService: RoomService);
    create(room: RoomEntity): Promise<RoomEntity>;
    findAll(): Promise<RoomEntity[]>;
    findOne(id: string): Promise<RoomEntity>;
    update(id: string, room: RoomEntity): Promise<RoomEntity>;
    remove(id: string): Promise<void>;
    grpcCreate(room: RoomEntity): Promise<RoomEntity>;
    grpcFindAll(): Promise<{
        rooms: RoomEntity[];
    }>;
    grpcFindOne(data: {
        id: string;
    }): Promise<RoomEntity>;
    grpcUpdate(data: {
        id: string;
        room: RoomEntity;
    }): Promise<RoomEntity>;
    grpcRemove(data: {
        id: string;
    }): Promise<{}>;
}
