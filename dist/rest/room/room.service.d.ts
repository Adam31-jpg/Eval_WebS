import { RoomEntity } from 'src/entities/room.entity';
import { Repository } from 'typeorm';
export declare class RoomService {
    private roomRepository;
    constructor(roomRepository: Repository<RoomEntity>);
    create(room: RoomEntity): Promise<RoomEntity>;
    findAll(): Promise<RoomEntity[]>;
    findOne(id: number): Promise<RoomEntity>;
    update(id: number, updateData: Partial<RoomEntity>): Promise<RoomEntity>;
    remove(id: number): Promise<void>;
}
