import { Injectable, NotFoundException } from '@nestjs/common';
import { ReservationEntity } from '../../entities/reservation.entity';
import { NotificationEntity } from '../../entities/notification.entity'; // AJOUT
import { from, map, Observable, switchMap, tap, catchError, of } from 'rxjs';
import { CreateReservationInput } from '../resolvers/dto/create-reservation.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusEnum } from '../../entities/status.enum';
import { NotificationClient } from '../../grpc-service/notification/notification.client';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(NotificationEntity) // AJOUT
    private readonly notificationRepository: Repository<NotificationEntity>, // AJOUT
    private readonly notificationClient: NotificationClient,
  ) { }

  listReservations(
    skip: number,
    limit: number,
  ): Observable<ReservationEntity[]> {
    return from(
      this.reservationRepository.find({
        relations: [],
        skip: skip || 0,
        take: limit || 10,
        order: { createdAt: 'DESC' }, // AJOUT: Ordre pour avoir les plus récentes en premier
      }),
    );
  }

  reservation(id: string): Observable<ReservationEntity | null> {
    return from(this.reservationRepository.findOne({ where: { id } })).pipe(
      map((reservation: ReservationEntity | null) => {
        return reservation;
      }),
      catchError(() => {
        return of(null);
      })
    );
  }

  createReservation(
    reservationDto: CreateReservationInput,
  ): Observable<ReservationEntity> {
    // Convertir les strings en dates et créer la réservation
    const reservation = {
      userId: reservationDto.userId,
      roomId: reservationDto.roomId,
      startTime: new Date(reservationDto.startTime),
      endTime: new Date(reservationDto.endTime),
      location: 'GraphQL Created Location',
      status: StatusEnum.PENDING,
    };

    return from(
      this.reservationRepository.save(
        this.reservationRepository.create(reservation),
      ),
    ).pipe(
      // Créer une notification via gRPC après sauvegarde
      tap((savedReservation) => {
        const notificationRequest = {
          reservationId: parseInt(savedReservation.id),
          message: `Nouvelle réservation GraphQL créée pour la chambre ${savedReservation.roomId}`,
          notificationDate: new Date().toISOString(),
          isSent: false,
        };

        console.log('📧 Création notification gRPC pour réservation:', savedReservation.id);

        // Appel asynchrone au microservice de notification via gRPC
        this.notificationClient.createNotification(notificationRequest).subscribe({
          next: (result) => {
            console.log('✅ Notification gRPC créée:', result);
          },
          error: (error) => {
            console.error('❌ Erreur lors de la création de la notification gRPC:', error);
          }
        });
      })
    );
  }

  updateReservation(
    id: string,
    input: Partial<CreateReservationInput>,
  ): Observable<ReservationEntity> {
    return this.reservation(id).pipe(
      switchMap((existingReservation) => {
        if (!existingReservation) {
          throw new NotFoundException(`Reservation with ID ${id} not found`);
        }

        // Convertir les strings en dates si nécessaire et préparer les données de mise à jour
        const updateData: any = { ...existingReservation };

        if (input.userId !== undefined) updateData.userId = input.userId;
        if (input.roomId !== undefined) updateData.roomId = input.roomId;
        if (input.startTime !== undefined) {
          updateData.startTime = new Date(input.startTime);
        }
        if (input.endTime !== undefined) {
          updateData.endTime = new Date(input.endTime);
        }

        // CORRECTION: Utiliser save() au lieu de update() pour forcer un refresh
        return from(this.reservationRepository.save(updateData));
      }),
      // Créer une notification de mise à jour via gRPC
      tap((updatedReservation) => {
        const notificationRequest = {
          reservationId: parseInt(id),
          message: `Réservation GraphQL ${id} mise à jour`,
          notificationDate: new Date().toISOString(),
          isSent: false,
        };

        console.log('📧 Création notification de mise à jour gRPC pour:', id);

        // Appel asynchrone au microservice de notification
        this.notificationClient.createNotification(notificationRequest).subscribe({
          next: (result) => {
            console.log('✅ Notification de mise à jour gRPC créée:', result);
          },
          error: (error) => {
            console.error('❌ Erreur lors de la création de la notification de mise à jour gRPC:', error);
          }
        });
      })
    );
  }

  deleteReservation(id: string): Observable<boolean> {
    // CORRECTION: Supprimer d'abord les notifications liées, puis la réservation
    return from(this.reservationRepository.findOne({ where: { id } })).pipe(
      switchMap((reservation) => {
        if (!reservation) {
          return of(false); // Réservation n'existe pas
        }

        console.log('🗑️ Suppression des notifications liées à la réservation:', id);

        // Supprimer toutes les notifications liées à cette réservation
        return from(
          this.notificationRepository.delete({ reservationId: parseInt(id) })
        ).pipe(
          switchMap(() => {
            console.log('🗑️ Suppression de la réservation:', id);
            // Puis supprimer la réservation
            return from(this.reservationRepository.delete(id));
          }),
          map((result) => {
            const success = result.affected ? result.affected > 0 : false;
            console.log(success ? '✅ Réservation supprimée avec succès' : '❌ Échec suppression réservation');
            return success;
          }),
          catchError((error) => {
            console.error('❌ Erreur lors de la suppression:', error);
            return of(false);
          })
        );
      })
    );
  }
}