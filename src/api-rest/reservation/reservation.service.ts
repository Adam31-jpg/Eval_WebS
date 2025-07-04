import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationEntity } from '../../entities/reservation.entity';
import { NotificationEntity } from '../../entities/notification.entity';
import { StatusEnum } from '../../entities/status.enum';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) { }

  async create(reservationData: any): Promise<ReservationEntity> {
    console.log('📝 Données reçues pour création réservation:', reservationData);

    const userId = reservationData.user_id || reservationData.userId;
    const roomId = reservationData.room_id || reservationData.roomId;
    const startTime = reservationData.start_time || reservationData.startTime;
    const endTime = reservationData.end_time || reservationData.endTime;

    if (!userId) {
      throw new Error('userId est requis pour créer une réservation');
    }
    if (!roomId) {
      throw new Error('roomId est requis pour créer une réservation');
    }
    if (!startTime) {
      throw new Error('startTime est requis pour créer une réservation');
    }
    if (!endTime) {
      throw new Error('endTime est requis pour créer une réservation');
    }

    const reservation = this.reservationRepository.create({
      userId: parseInt(userId.toString()),
      roomId: parseInt(roomId.toString()),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      location: reservationData.location || 'Default location',
      status: reservationData.status || StatusEnum.PENDING,
    });

    console.log('💾 Réservation à sauvegarder:', reservation);

    const savedReservation = await this.reservationRepository.save(reservation);
    console.log('✅ Réservation sauvegardée:', savedReservation);

    const notificationEntity = this.notificationRepository.create({
      reservationId: parseInt(savedReservation.id),
      message: `Nouvelle réservation créée pour la chambre ${savedReservation.roomId}`,
      notificationDate: new Date(),
      isSent: false,
    });

    try {
      await this.notificationRepository.save(notificationEntity);
      console.log('✅ Notification sauvegardée en base');
    } catch (error) {
      console.error('❌ Erreur sauvegarde notification:', error);
    }

    const reservationWithRelations = await this.reservationRepository.findOne({
      where: { id: savedReservation.id },
      relations: ['user', 'room'],
    });

    console.log('📋 Réservation avec relations:', reservationWithRelations);

    return reservationWithRelations || savedReservation;
  }

  async update(
    id: number,
    updateData: Partial<ReservationEntity>,
  ): Promise<ReservationEntity> {
    console.log(`📝 Mise à jour réservation ${id} avec:`, updateData);

    const existingReservation = await this.findOne(id);

    const updateFields = {
      userId: updateData.userId || updateData['user_id'],
      roomId: updateData.roomId || updateData['room_id'],
      startTime: updateData.startTime || updateData['start_time'],
      endTime: updateData.endTime || updateData['end_time'],
      status: updateData.status,
      location: updateData.location,
    };

    const updatedReservation = {
      ...existingReservation,
      ...(updateFields.userId && { userId: parseInt(updateFields.userId.toString()) }),
      ...(updateFields.roomId && { roomId: parseInt(updateFields.roomId.toString()) }),
      ...(updateFields.startTime && { startTime: new Date(updateFields.startTime) }),
      ...(updateFields.endTime && { endTime: new Date(updateFields.endTime) }),
      ...(updateFields.status && { status: updateFields.status }),
      ...(updateFields.location && { location: updateFields.location }),
    };

    const result = await this.reservationRepository.save(updatedReservation);
    console.log('✅ Réservation mise à jour:', result);

    const resultWithRelations = await this.reservationRepository.findOne({
      where: { id: result.id },
      relations: ['user', 'room'],
    });

    if (updateData.status) {
      let message = '';
      switch (updateData.status) {
        case StatusEnum.APPROVED:
          message = `Votre réservation #${id} a été approuvée`;
          break;
        case StatusEnum.CANCELLED:
          message = `Votre réservation #${id} a été annulée`;
          break;
        case StatusEnum.PENDING:
          message = `Votre réservation #${id} est en attente de confirmation`;
          break;
        default:
          message = `Le statut de votre réservation #${id} a été mis à jour`;
      }

      const notificationEntity = this.notificationRepository.create({
        reservationId: id,
        message,
        notificationDate: new Date(),
        isSent: false,
      });

      try {
        await this.notificationRepository.save(notificationEntity);
        console.log('✅ Notification de mise à jour sauvegardée en base');
      } catch (error) {
        console.error('❌ Erreur sauvegarde notification mise à jour:', error);
      }
    }

    return resultWithRelations || result;
  }

  async findAll(): Promise<ReservationEntity[]> {
    return this.reservationRepository.find({
      relations: ['user', 'room'],
    });
  }

  async findOne(id: number): Promise<ReservationEntity> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: id.toString() },
      relations: ['user', 'room'],
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async remove(id: number): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: id.toString() },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    try {
      await this.notificationRepository.delete({ reservationId: id });
      await this.reservationRepository.delete(id);
    } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
      throw error;
    }
  }
}