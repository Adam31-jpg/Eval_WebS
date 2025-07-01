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
import { Observable } from 'rxjs';
import { ReservationService } from '../services/reservation.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gq-auth.guard';
import { CreateReservationInput } from './dto/create-reservation.input';

@ObjectType()
export class ReservationType {
  @Field(() => ID) id: string;
  @Field() userId: string;        // ← AJOUTÉ
  @Field() roomId: string;        // ← AJOUTÉ  
  @Field() startTime: string;     // ← CHANGÉ de start_time
  @Field() endTime: string;       // ← CHANGÉ de end_time
  @Field() createdAt: string;     // ← CHANGÉ de created_at
}

@Resolver(() => ReservationType)
export class ReservationResolver {
  constructor(private readonly reservationService: ReservationService) { }

  @Query(() => [ReservationType])
  @UseGuards(GqlAuthGuard)
  listReservations(
    @Args('skip', { type: () => Int, nullable: true }) skip: number,    // ← AJOUTÉ type Int
    @Args('limit', { type: () => Int, nullable: true }) limit: number,  // ← AJOUTÉ type Int
  ): Observable<ReservationEntity[]> {
    return this.reservationService.listReservations(skip, limit);
  }

  @Query(() => ReservationType, { nullable: true })
  @UseGuards(GqlAuthGuard)
  reservation(@Args('id', { type: () => ID }) id: string): Observable<ReservationEntity> {  // ← CHANGÉ nom + type ID
    return this.reservationService.reservation(id);
  }

  createReservation(
    @Args('userId', { type: () => Int }) userId: number,  // ← Direct en number
    @Args('roomId', { type: () => Int }) roomId: number,  // ← Direct en number
    @Args('startTime') startTime: string,
    @Args('endTime') endTime: string,
  ): Observable<ReservationEntity> {
    return this.reservationService.createReservation({
      userId, roomId, startTime, endTime
    });
  }

  @Mutation(() => ReservationType)
  @UseGuards(GqlAuthGuard)
  updateReservation(
    @Args('id', { type: () => ID }) id: string,
    @Args('userId', { nullable: true, type: () => Int }) userId?: number,    // ← CHANGÉ en number
    @Args('roomId', { nullable: true, type: () => Int }) roomId?: number,    // ← CHANGÉ en number
    @Args('startTime', { nullable: true }) startTime?: string,
    @Args('endTime', { nullable: true }) endTime?: string,
  ): Observable<ReservationEntity> {
    const input: Partial<CreateReservationInput> = {
      userId,
      roomId,
      startTime,
      endTime
    };
    return this.reservationService.updateReservation(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  deleteReservation(@Args('id', { type: () => ID }) id: string): Observable<boolean> {  // ← CHANGÉ nom
    return this.reservationService.deleteReservation(id);
  }
}