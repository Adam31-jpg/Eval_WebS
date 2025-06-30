import { NotificationEntity } from 'src/entities/notification.entity';
import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    findAll(): Promise<NotificationEntity[]>;
    findOne(id: string): Promise<NotificationEntity | null>;
    create(createNotificationDto: NotificationEntity): Promise<NotificationEntity>;
    update(id: string, updateNotificationDto: NotificationEntity): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<null | undefined>;
    grpcCreate(data: {
        reservationId: number;
        message: string;
        notificationDate: string;
        isSent: boolean;
    }): Promise<NotificationEntity>;
    grpcFindAll(): Promise<{
        notifications: {
            notificationDate: string;
            id: string;
            reservationId: number;
            reservation?: import("../../entities/reservation.entity").ReservationEntity;
            message: string;
            isSent: boolean;
        }[];
    }>;
    grpcFindOne(data: {
        id: string;
    }): Promise<{
        notificationDate: string;
        id: string;
        reservationId: number;
        reservation?: import("../../entities/reservation.entity").ReservationEntity;
        message: string;
        isSent: boolean;
    } | null>;
    grpcUpdate(data: {
        id: string;
        notification: NotificationEntity;
    }): Promise<{
        notificationDate: string;
        id: string;
        reservationId: number;
        reservation?: import("../../entities/reservation.entity").ReservationEntity;
        message: string;
        isSent: boolean;
    } | null>;
    grpcRemove(data: {
        id: string;
    }): Promise<{}>;
}
