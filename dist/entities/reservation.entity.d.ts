import { RoomEntity } from './room.entity';
import { StatusEnum } from './status.enum';
import { UserEntity } from './user.entity';
export declare class ReservationEntity {
    id: string;
    userId: number;
    user: UserEntity;
    roomId: number;
    room?: RoomEntity;
    location: string;
    createdAt: Date;
    validatesTimes(): void;
    startTime: Date;
    endTime: Date;
    status: StatusEnum;
}
