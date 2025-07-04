// src/graphql/services/reservation.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReservationEntity } from '../../entities/reservation.entity';
import { NotificationEntity } from '../../entities/notification.entity';
import { from, map, Observable, switchMap, catchError, throwError, forkJoin } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusEnum } from '../../entities/status.enum';
import { NotificationClient } from 'src/grpc-service/notification/notification.client';
import { CreateReservationInput } from '../resolvers/dto/create-reservation.input';
import { UpdateReservationInput } from '../resolvers/dto/update-reservation.input';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly notificationClient: NotificationClient,
  ) { }

  listReservations(
    skip: number,
    limit: number,
  ): Observable<ReservationEntity[]> {
    return from(
      this.reservationRepository.find({
        relations: ['user', 'room'],
        skip: skip || 0,
        take: limit || 10,
        order: { createdAt: 'DESC' },
      }),
    );
  }

  reservation(id: string): Observable<ReservationEntity> {
    return from(this.reservationRepository.findOne({
      where: { id },
      relations: ['user', 'room']
    })).pipe(
      map((reservation: ReservationEntity | null) => {
        if (!reservation) {
          throw new NotFoundException(`Reservation with ID ${id} not found`);
        }
        return reservation;
      }),
      catchError((error) => {
        console.error('❌ Erreur lors de la récupération de réservation:', error);
        return throwError(() => error);
      })
    );
  }

  createReservation(
    reservationDto: CreateReservationInput,
  ): Observable<ReservationEntity> {
    console.log('📝 GraphQL: Création réservation avec:', reservationDto);

    // CORRECTION: Validation des données d'entrée
    if (!reservationDto.userId || !reservationDto.roomId) {
      throw new Error('userId et roomId sont requis');
    }
    if (!reservationDto.startTime || !reservationDto.endTime) {
      throw new Error('startTime et endTime sont requis');
    }

    // Convertir les strings en dates et créer la réservation
    const reservation = {
      userId: reservationDto.userId,
      roomId: reservationDto.roomId,
      startTime: new Date(reservationDto.startTime),
      endTime: new Date(reservationDto.endTime),
      location: 'GraphQL Created Location',
      status: StatusEnum.PENDING,
    };

    console.log('💾 GraphQL: Réservation à sauvegarder:', reservation);

    return from(
      this.reservationRepository.save(
        this.reservationRepository.create(reservation),
      ),
    ).pipe(
      switchMap((savedReservation) => {
        console.log('✅ GraphQL: Réservation sauvegardée:', savedReservation);

        // CORRECTION: Créer la notification en base ET via gRPC
        const notificationEntity = this.notificationRepository.create({
          reservationId: parseInt(savedReservation.id),
          message: `Nouvelle réservation GraphQL créée pour la chambre ${savedReservation.roomId}`,
          notificationDate: new Date(),
          isSent: false,
        });

        const saveNotification$ = from(this.notificationRepository.save(notificationEntity));

        // Créer une notification via gRPC en parallèle
        const notificationRequest = {
          reservationId: parseInt(savedReservation.id),
          message: `Nouvelle réservation GraphQL créée pour la chambre ${savedReservation.roomId}`,
          notificationDate: new Date().toISOString(),
          isSent: false,
        };

        // Appel gRPC asynchrone (ne pas bloquer si le service est indisponible)
        try {
          this.notificationClient.createNotification(notificationRequest).subscribe({
            next: (result) => {
              console.log('✅ Notification gRPC créée:', result);
            },
            error: (error) => {
              console.error('❌ Erreur lors de la création de la notification gRPC:', error);
            }
          });
        } catch (error) {
          console.error('❌ Service gRPC indisponible:', error);
        }

        // Recharger avec les relations ET sauvegarder la notification
        const reloadReservation$ = from(this.reservationRepository.findOne({
          where: { id: savedReservation.id },
          relations: ['user', 'room']
        }));

        return forkJoin([reloadReservation$, saveNotification$]).pipe(
          map(([reservationWithRelations, notification]) => {
            console.log('📋 GraphQL: Réservation avec relations:', reservationWithRelations);
            console.log('📧 Notification sauvegardée:', notification);
            if (!reservationWithRelations) {
              throw new Error('Impossible de recharger la réservation avec ses relations');
            }
            return reservationWithRelations;
          })
        );
      }),
      catchError((error) => {
        console.error('❌ GraphQL: Erreur lors de la création de réservation:', error);
        return throwError(() => error);
      })
    );
  }

  updateReservation(
    id: string,
    input: Partial<UpdateReservationInput>,
  ): Observable<ReservationEntity> {
    console.log(`📝 GraphQL: Mise à jour réservation ${id} avec:`, input);

    return this.reservation(id).pipe(
      switchMap((existingReservation) => {
        console.log('📋 GraphQL: Réservation existante:', existingReservation);

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

        console.log('💾 GraphQL: Données de mise à jour:', updateData);

        return from(this.reservationRepository.save(updateData));
      }),
      switchMap((updatedReservation) => {
        console.log('✅ GraphQL: Réservation mise à jour:', updatedReservation);

        // Créer une notification de mise à jour en base
        const notificationEntity = this.notificationRepository.create({
          reservationId: parseInt(id),
          message: `Réservation GraphQL ${id} mise à jour`,
          notificationDate: new Date(),
          isSent: false,
        });

        const saveNotification$ = from(this.notificationRepository.save(notificationEntity));

        // Appel gRPC asynchrone
        try {
          const notificationRequest = {
            reservationId: parseInt(id),
            message: `Réservation GraphQL ${id} mise à jour`,
            notificationDate: new Date().toISOString(),
            isSent: false,
          };

          this.notificationClient.createNotification(notificationRequest).subscribe({
            next: (result) => {
              console.log('✅ Notification de mise à jour gRPC créée:', result);
            },
            error: (error) => {
              console.error('❌ Erreur lors de la création de la notification de mise à jour gRPC:', error);
            }
          });
        } catch (error) {
          console.error('❌ Service gRPC indisponible:', error);
        }

        // Recharger avec les relations
        const reloadReservation$ = from(this.reservationRepository.findOne({
          where: { id: updatedReservation.id },
          relations: ['user', 'room']
        }));

        return forkJoin([reloadReservation$, saveNotification$]).pipe(
          map(([reservationWithRelations, notification]) => {
            console.log('📋 GraphQL: Réservation mise à jour avec relations:', reservationWithRelations);
            console.log('📧 Notification de mise à jour sauvegardée:', notification);
            if (!reservationWithRelations) {
              throw new Error('Impossible de recharger la réservation mise à jour avec ses relations');
            }
            return reservationWithRelations;
          })
        );
      }),
      catchError((error) => {
        console.error('❌ GraphQL: Erreur lors de la mise à jour de réservation:', error);
        return throwError(() => error);
      })
    );
  }

  deleteReservation(id: string): Observable<boolean> {
    console.log(`🗑️ GraphQL: Suppression réservation ${id}`);

    return from(this.reservationRepository.findOne({ where: { id } })).pipe(
      switchMap((reservation) => {
        if (!reservation) {
          console.log(`❌ GraphQL: Réservation ${id} non trouvée`);
          return throwError(() => new NotFoundException(`Reservation with ID ${id} not found`));
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
            return throwError(() => error);
          })
        );
      })
    );
  }
}