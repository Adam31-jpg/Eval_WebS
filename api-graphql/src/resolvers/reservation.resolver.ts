import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  ID,
} from '@nestjs/graphql';

import { ReservationEntity } from '../entities/reservation.entity';
import { StatusEnum } from '../entities/status.enum';
import { RoomType } from './room.resolver';
import { UserType } from './user.resolver';
import { Observable } from 'rxjs';
import { CreateReservationInput } from './dto/create-reservation.input';
import { ReservationService } from '../services/reservation.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gq-auth.guard';

@ObjectType()
export class ReservationType {
  @Field(() => ID) id: string;
  @Field() start_time: string;
  @Field() end_time: string;
  @Field() status: StatusEnum;
  @Field() location: string;
  @Field() created_at: string;
  @Field(() => RoomType, {
    nullable: true,
  })
  room: RoomType;
  @Field(() => UserType, {
    nullable: true,
  })
  user: UserType;
}

@Resolver(() => ReservationType)
export class ReservationResolver {
  constructor(private readonly reservationService: ReservationService) {}

  @Query(() => [ReservationType])
  @UseGuards(GqlAuthGuard)
  listReservations(
    @Args('skip') skip: number,
    @Args('limit') limit: number,
  ): Observable<ReservationEntity[]> {
    return this.reservationService.listReservations(skip, limit);
  }

  @Query(() => ReservationType, { nullable: true })
  @UseGuards(GqlAuthGuard)
  room(@Args('id') id: string): Observable<ReservationEntity> {
    return this.reservationService.reservation(id);
  }

  @Mutation(() => ReservationType)
  @UseGuards(GqlAuthGuard)
  createReservation(
    @Args('input') input: CreateReservationInput,
  ): Observable<ReservationEntity> {
    return this.reservationService.createReservation(input);
  }

  @Mutation(() => RoomType)
  @UseGuards(GqlAuthGuard)
  updateRoom(
    @Args('id') id: string,
    @Args('input') input: CreateReservationInput,
  ): Observable<ReservationEntity> {
    return this.reservationService.updateReservation(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  deleteRoom(@Args('id') id: string): Observable<boolean> {
    return this.reservationService.deleteReservation(id);
  }
}
