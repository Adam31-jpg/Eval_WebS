// src/api-rest/reservation/reservation.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationEntity } from '../../entities/reservation.entity';
import { NotificationEntity } from '../../entities/notification.entity';
import { StatusEnum } from '../../entities/status.enum';
import { NotificationClient } from '../../grpc-service/notification/notification.client';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
    private notificationClient: NotificationClient,
  ) { }

  async create(reservationData: any): Promise<ReservationEntity> {
    console.log('📝 Données reçues pour création réservation:', reservationData);

    // CORRECTION: Validation des données obligatoires
    if (!reservationData.user_id) {
      throw new Error('userId est requis pour créer une réservation');
    }
    if (!reservationData.room_id) {
      throw new Error('roomId est requis pour créer une réservation');
    }
    if (!reservationData.start_time) {
      throw new Error('startTime est requis pour créer une réservation');
    }
    if (!reservationData.end_time) {
      throw new Error('endTime est requis pour créer une réservation');
    }

    // CORRECTION: Créer l'objet réservation avec toutes les données nécessaires
    const reservation = this.reservationRepository.create({
      userId: parseInt(reservationData.user_id.toString()),
      roomId: parseInt(reservationData.room_id.toString()),
      startTime: new Date(reservationData.start_time),
      endTime: new Date(reservationData.end_time),
      location: reservationData.location || 'Default location',
      status: reservationData.status || StatusEnum.PENDING,
    });

    console.log('💾 Réservation à sauvegarder:', reservation);

    // Sauvegarder la réservation
    const savedReservation = await this.reservationRepository.save(reservation);
    console.log('✅ Réservation sauvegardée:', savedReservation);

    // CORRECTION: Recharger la réservation avec les relations pour la réponse
    const reservationWithRelations = await this.reservationRepository.findOne({
      where: { id: savedReservation.id },
      relations: ['user', 'room'], // Charger les relations user et room
    });

    console.log('📋 Réservation avec relations:', reservationWithRelations);

    // Créer une notification via gRPC
    const notificationRequest = {
      reservationId: parseInt(savedReservation.id),
      message: `Nouvelle réservation créée pour la chambre ${savedReservation.roomId}`,
      notificationDate: new Date().toISOString(),
      isSent: false,
    };

    console.log('📧 Création notification gRPC:', notificationRequest);

    // Appel asynchrone au microservice de notification
    this.notificationClient.createNotification(notificationRequest).subscribe(
      (result) => console.log('✅ Notification créée:', result),
      (error) => console.error('❌ Erreur notification:', error),
    );

    // CORRECTION: Retourner la réservation avec les relations chargées
    return reservationWithRelations || savedReservation;
  }

  async update(
    id: number,
    updateData: Partial<ReservationEntity>,
  ): Promise<ReservationEntity> {
    console.log(`📝 Mise à jour réservation ${id} avec:`, updateData);

    const existingReservation = await this.findOne(id);

    // Merger les données correctement
    const updatedReservation = {
      ...existingReservation,
      ...updateData,
      // S'assurer que les IDs restent des numbers
      userId: updateData.userId ? parseInt(updateData.userId.toString()) : existingReservation.userId,
      roomId: updateData.roomId ? parseInt(updateData.roomId.toString()) : existingReservation.roomId,
    };

    const result = await this.reservationRepository.save(updatedReservation);
    console.log('✅ Réservation mise à jour:', result);

    // CORRECTION: Recharger avec les relations
    const resultWithRelations = await this.reservationRepository.findOne({
      where: { id: result.id },
      relations: ['user', 'room'],
    });

    // Si le statut a été mis à jour, créer une notification
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

      const notification = {
        reservationId: id,
        message,
        notificationDate: new Date().toISOString(),
        isSent: false,
      };

      this.notificationClient.createNotification(notification).subscribe(
        (result) => console.log('✅ Notification de mise à jour créée:', result),
        (error) => console.error('❌ Erreur notification mise à jour:', error),
      );
    }

    return resultWithRelations || result;
  }

  async findAll(): Promise<ReservationEntity[]> {
    // CORRECTION: Charger les relations dans findAll aussi
    return this.reservationRepository.find({
      relations: ['user', 'room'],
    });
  }

  async findOne(id: number): Promise<ReservationEntity> {
    // CORRECTION: Charger les relations dans findOne aussi
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
      // Supprimer d'abord toutes les notifications liées à cette réservation
      await this.notificationRepository.delete({ reservationId: id });

      // Puis supprimer la réservation
      await this.reservationRepository.delete(id);
    } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
      throw error;
    }
  }
}