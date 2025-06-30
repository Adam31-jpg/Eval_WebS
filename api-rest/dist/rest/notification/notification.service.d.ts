import { NotificationEntity } from 'src/entities/notification.entity';
import { Repository } from 'typeorm';
export declare class NotificationService {
    private readonly notificationRepository;
    constructor(notificationRepository: Repository<NotificationEntity>);
    create(notification: NotificationEntity): Promise<NotificationEntity>;
    findAll(): Promise<NotificationEntity[]>;
    findOne(id: number): Promise<NotificationEntity | null>;
    update(id: number, notification: NotificationEntity): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<null | undefined>;
}
