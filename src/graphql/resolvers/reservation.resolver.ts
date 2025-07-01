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
import { Observable, map } from 'rxjs';
import { ReservationService } from '../services/reservation.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gq-auth.guard';
import { CreateReservationInput } from './dto/create-reservation.input';

@ObjectType()
export class ReservationType {
  @Field(() => ID) id: string;
  @Field() userId: string;
  @Field() roomId: string;
  @Field() startTime: string;
  @Field() endTime: string;
  @Field() createdAt: string;
}

// CORRECTION: Fonction utilitaire pour formater les entités
function formatReservationEntity(reservation: ReservationEntity): any {
  return {
    ...reservation,
    userId: reservation.userId?.toString(),
    roomId: reservation.roomId?.toString(),
    startTime: reservation.startTime instanceof Date
      ? reservation.startTime.toISOString()
      : reservation.startTime,
    endTime: reservation.endTime instanceof Date
      ? reservation.endTime.toISOString()
      : reservation.endTime,
    createdAt: reservation.createdAt instanceof Date
      ? reservation.createdAt.toISOString()
      : reservation.createdAt,
  };
}

@Resolver(() => ReservationType)
export class ReservationResolver {
  constructor(private readonly reservationService: ReservationService) { }

  @Query(() => [ReservationType])
  @UseGuards(GqlAuthGuard)
  listReservations(
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('limit', { type: () => Int, nullable: true }) limit: number,
  ): Observable<any[]> {
    return this.reservationService.listReservations(skip || 0, limit || 10).pipe(
      map(reservations => reservations.map(formatReservationEntity))
    );
  }

  @Query(() => ReservationType, { nullable: true })
  @UseGuards(GqlAuthGuard)
  reservation(@Args('id', { type: () => ID }) id: string): Observable<any | null> {
    return this.reservationService.reservation(id).pipe(
      map(reservation => reservation ? formatReservationEntity(reservation) : null)
    );
  }

  @Mutation(() => ReservationType)
  @UseGuards(GqlAuthGuard)
  createReservation(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('roomId', { type: () => Int }) roomId: number,
    @Args('startTime') startTime: string,
    @Args('endTime') endTime: string,
  ): Observable<any> {
    return this.reservationService.createReservation({
      userId, roomId, startTime, endTime
    }).pipe(
      map(formatReservationEntity)
    );
  }

  @Mutation(() => ReservationType)
  @UseGuards(GqlAuthGuard)
  updateReservation(
    @Args('id', { type: () => ID }) id: string,
    @Args('userId', { nullable: true, type: () => Int }) userId?: number,
    @Args('roomId', { nullable: true, type: () => Int }) roomId?: number,
    @Args('startTime', { nullable: true }) startTime?: string,
    @Args('endTime', { nullable: true }) endTime?: string,
  ): Observable<any> {
    const input: Partial<CreateReservationInput> = {
      userId,
      roomId,
      startTime,
      endTime
    };
    return this.reservationService.updateReservation(id, input).pipe(
      map(formatReservationEntity)
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  deleteReservation(@Args('id', { type: () => ID }) id: string): Observable<boolean> {
    return this.reservationService.deleteReservation(id);
  }
}