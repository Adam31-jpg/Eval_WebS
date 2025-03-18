import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  ID,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationEntity } from '../../entities/reservation.entity';
import { StatusEnum } from '../../entities/status.enum';
import { RoomType } from './room.resolver';
import { UserType } from './user.resolver';
import { from, Observable } from 'rxjs';
import { CreateReservationInput } from './dto/create-reservation.input';

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
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
  ) {}

  @Query(() => [ReservationType])
  listReservations(
    @Args('skip') skip: number,
    @Args('limit') limit: number,
  ): Observable<ReservationEntity[]> {
    return from(
      this.reservationRepository.find({
        relations: ['user', 'room'],
        skip: skip,
        take: limit,
      }),
    );
  }

  @Mutation(() => ReservationType)
  createReservation(
    @Args('input') input: CreateReservationInput,
  ): Observable<ReservationEntity> {
    return from(this.reservationRepository.save(input as ReservationEntity));
  }
}
