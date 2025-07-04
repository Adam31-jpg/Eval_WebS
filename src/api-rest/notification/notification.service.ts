import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) { }
  // async create(notification: NotificationEntity) {
  //   return await this.notificationRepository.save(notification);
  // }
  async create(data: any): Promise<NotificationEntity> {

    const reservationId = data.reservationId || data.reservation_id;

    if (!reservationId) {
      throw new Error('reservationId est requis pour créer une notification');
    }

    const entityData = {
      reservation_id: reservationId,
      message: data.message,
      notification_date: data.notificationDate || data.notification_date || new Date().toISOString(),
    };


    const notification = this.notificationRepository.create({
      reservationId: entityData.reservation_id,
      message: entityData.message,
      notificationDate: new Date(entityData.notification_date),
      isSent: false,
    });

    const savedNotification = await this.notificationRepository.save(notification);

    return savedNotification;
  }

  async findAll() {
    return await this.notificationRepository.find();
  }

  async findOne(id: number): Promise<NotificationEntity | null> {
    // Use an options object with a where clause
    const reservation = await this.notificationRepository.findOne({
      where: { id: id.toString() },
    });
    if (!reservation) {
      return null;
    }
    return reservation;
  }

  async update(id: number, notification: NotificationEntity) {
    return await this.notificationRepository.update(id, notification);
  }

  async remove(id: number) {
    const reservation = await this.notificationRepository.findOne({
      where: { id: id.toString() },
    });
    if (!reservation) {
      return null;
    }
    await this.notificationRepository.delete(id);
  }
}
