import { ReservationEntity } from 'src/entities/reservation.entity';
import { Repository } from 'typeorm';
import { NotificationClient } from '../../grpc/notification/notification.client';
export declare class ReservationService {
    private reservationRepository;
    private notificationClient;
    constructor(reservationRepository: Repository<ReservationEntity>, notificationClient: NotificationClient);
    create(reservation: ReservationEntity): Promise<ReservationEntity>;
    update(id: number, updateData: Partial<ReservationEntity>): Promise<ReservationEntity>;
    findAll(): Promise<ReservationEntity[]>;
    findOne(id: number): Promise<ReservationEntity>;
    remove(id: number): Promise<void>;
}
