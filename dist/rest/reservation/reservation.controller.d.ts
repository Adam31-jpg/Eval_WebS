import { ReservationEntity } from 'src/entities/reservation.entity';
import { ReservationService } from './reservation.service';
export declare class ReservationController {
    private readonly reservationService;
    constructor(reservationService: ReservationService);
    create(reservation: ReservationEntity): Promise<ReservationEntity>;
    findAll(): Promise<ReservationEntity[]>;
    findOne(id: string): Promise<ReservationEntity>;
    update(id: string, updateReservationDto: ReservationEntity): Promise<ReservationEntity>;
    remove(id: string): Promise<void>;
    grpcCreate(reservation: ReservationEntity): Promise<ReservationEntity>;
    grpcFindAll(): Promise<{
        reservations: {
            createdAt: string;
            startTime: string;
            endTime: string;
            id: string;
            userId: number;
            user: import("../../entities/user.entity").UserEntity;
            roomId: number;
            room?: import("../../entities/room.entity").RoomEntity;
            location: string;
            status: import("../../entities/status.enum").StatusEnum;
        }[];
    }>;
    grpcFindOne(data: {
        id: string;
    }): Promise<{
        createdAt: string;
        startTime: string;
        endTime: string;
        id: string;
        userId: number;
        user: import("../../entities/user.entity").UserEntity;
        roomId: number;
        room?: import("../../entities/room.entity").RoomEntity;
        location: string;
        status: import("../../entities/status.enum").StatusEnum;
    }>;
    grpcUpdate(data: {
        id: string;
        reservation: ReservationEntity;
    }): Promise<{
        createdAt: string;
        startTime: string;
        endTime: string;
        id: string;
        userId: number;
        user: import("../../entities/user.entity").UserEntity;
        roomId: number;
        room?: import("../../entities/room.entity").RoomEntity;
        location: string;
        status: import("../../entities/status.enum").StatusEnum;
    }>;
    grpcRemove(data: {
        id: string;
    }): Promise<{}>;
}
