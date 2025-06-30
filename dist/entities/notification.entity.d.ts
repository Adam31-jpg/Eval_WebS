import { ReservationEntity } from './reservation.entity';
export declare class NotificationEntity {
    id: string;
    reservationId: number;
    reservation?: ReservationEntity;
    message: string;
    notificationDate: Date;
    isSent: boolean;
}
