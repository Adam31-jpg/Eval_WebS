import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationEntity } from 'src/entities/reservation.entity';
import { StatusEnum } from 'src/entities/status.enum';
import { Repository } from 'typeorm';
import { NotificationClient } from '../../grpc/notification/notification.client';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private reservationRepository: Repository<ReservationEntity>,
    private notificationClient: NotificationClient,
  ) { }

  async create(reservation: ReservationEntity): Promise<ReservationEntity> {
    // Sauvegarder la réservation
    const savedReservation = await this.reservationRepository.save(reservation);

    // Créer une notification via gRPC
    const notificationRequest = {
      reservationId: parseInt(savedReservation.id),
      message: `Nouvelle réservation créée pour la chambre ${savedReservation.roomId}`,
      notificationDate: new Date().toISOString(),
      isSent: false,
    };

    console.log('Notification à créer:', notificationRequest);

    // Appel asynchrone au microservice de notification
    this.notificationClient.createNotification(notificationRequest).subscribe(
      (result) => console.log('Notification créée:', result),
      (error) =>
        console.error('Erreur lors de la création de la notification:', error),
    );
    return savedReservation;
  }

  async update(
    id: number,
    updateData: Partial<ReservationEntity>,
  ): Promise<ReservationEntity> {
    await this.reservationRepository.update(id, updateData);
    const updatedReservation = await this.findOne(id);

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

      // Appel asynchrone au microservice de notification
      this.notificationClient.createNotification(notification).subscribe(
        (result) => console.log('Notification de mise à jour créée:', result),
        (error) =>
          console.error(
            'Erreur lors de la création de la notification de mise à jour:',
            error,
          ),
      );
    }

    return updatedReservation;
  }

  // Autres méthodes inchangées...
  async findAll(): Promise<ReservationEntity[]> {
    return this.reservationRepository.find();
  }

  async findOne(id: number): Promise<ReservationEntity> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: id.toString() },
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async remove(id: number): Promise<void> {
    await this.reservationRepository.delete(id);
  }
}
