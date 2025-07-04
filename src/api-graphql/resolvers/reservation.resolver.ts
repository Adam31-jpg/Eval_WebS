import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  ID,
  Int,
} from '@nestjs/graphql';

import { ReservationEntity } from '../../entities/reservation.entity';
import { Observable, map, catchError, throwError } from 'rxjs';
import { ReservationService } from '../services/reservation.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gq-auth.guard';
import { UpdateReservationInput } from './dto/update-reservation.input';
import { CreateReservationInput } from './dto/create-reservation.input';

@ObjectType()
export class ReservationType {
  @Field(() => ID) id: string;
  @Field(() => Int) userId: number;
  @Field(() => Int) roomId: number;
  @Field() startTime: string;
  @Field() endTime: string;
  @Field() createdAt: string;
  @Field({ nullable: true }) location?: string;
  @Field({ nullable: true }) status?: string;
}

function formatReservationEntity(reservation: ReservationEntity): any {
  if (!reservation) return null;

  return {
    id: reservation.id.toString(),
    userId: parseInt(reservation.userId.toString()),
    roomId: parseInt(reservation.roomId.toString()),
    startTime: reservation.startTime instanceof Date
      ? reservation.startTime.toISOString()
      : reservation.startTime,
    endTime: reservation.endTime instanceof Date
      ? reservation.endTime.toISOString()
      : reservation.endTime,
    createdAt: reservation.createdAt instanceof Date
      ? reservation.createdAt.toISOString()
      : reservation.createdAt,
    location: reservation.location || null,
    status: reservation.status || null,
  };
}

@Resolver(() => ReservationType)
export class ReservationResolver {
  constructor(private readonly reservationService: ReservationService) { }

  @Query(() => [ReservationType])
  @UseGuards(GqlAuthGuard)
  listReservations(
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 }) skip: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit: number,
  ): Observable<any[]> {
    console.log(`🔍 GraphQL listReservations appelé avec skip: ${skip}, limit: ${limit}`);

    return this.reservationService.listReservations(skip, limit).pipe(
      map(reservations => {
        console.log(`📊 GraphQL listReservations retourne ${reservations.length} réservations`);
        return reservations.map(formatReservationEntity);
      }),
      catchError((error) => {
        console.error('❌ GraphQL listReservations erreur:', error);
        return throwError(() => error);
      })
    );
  }

  @Query(() => ReservationType, { nullable: true })
  @UseGuards(GqlAuthGuard)
  reservation(@Args('id', { type: () => ID }) id: string): Observable<any> {
    console.log(`🔍 GraphQL reservation appelé avec ID: ${id}`);

    if (!id) {
      throw new Error('ID est requis');
    }

    return this.reservationService.reservation(id).pipe(
      map(reservation => {
        console.log(`📋 GraphQL reservation résultat:`, reservation ? `ID=${reservation.id}` : 'null');
        return formatReservationEntity(reservation);
      }),
      catchError((error) => {
        console.error('❌ GraphQL reservation erreur:', error);
        return throwError(() => error);
      })
    );
  }

  @Mutation(() => ReservationType)
  @UseGuards(GqlAuthGuard)
  createReservation(
    @Args('input') input: CreateReservationInput,
  ): Observable<any> {
    console.log(`➕ GraphQL createReservation appelé avec:`, input);

    if (!input.userId || !input.roomId || !input.startTime || !input.endTime) {
      throw new Error('Tous les paramètres sont requis: userId, roomId, startTime, endTime');
    }

    return this.reservationService.createReservation(input).pipe(
      map(reservation => {
        console.log(`✅ GraphQL createReservation terminé:`, reservation);
        return formatReservationEntity(reservation);
      }),
      catchError((error) => {
        console.error('❌ GraphQL createReservation erreur:', error);
        return throwError(() => error);
      })
    );
  }

  @Mutation(() => ReservationType)
  @UseGuards(GqlAuthGuard)
  updateReservation(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateReservationInput
  ): Observable<any> {
    console.log(`📝 GraphQL updateReservation appelé pour ID: ${id}`, input);

    if (!id) {
      throw new Error('ID est requis pour la mise à jour');
    }

    return this.reservationService.updateReservation(id, input).pipe(
      map(reservation => {
        console.log(`✅ GraphQL updateReservation terminé:`, reservation);
        return formatReservationEntity(reservation);
      }),
      catchError((error) => {
        console.error('❌ GraphQL updateReservation erreur:', error);
        return throwError(() => error);
      })
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  deleteReservation(@Args('id', { type: () => ID }) id: string): Observable<boolean> {
    console.log(`🗑️ GraphQL deleteReservation appelé pour ID: ${id}`);

    if (!id) {
      throw new Error('ID est requis pour la suppression');
    }

    return this.reservationService.deleteReservation(id).pipe(
      map(result => {
        console.log(`🗑️ GraphQL deleteReservation résultat: ${result}`);
        return result;
      }),
      catchError((error) => {
        console.error('❌ GraphQL deleteReservation erreur:', error);
        return throwError(() => error);
      })
    );
  }
}