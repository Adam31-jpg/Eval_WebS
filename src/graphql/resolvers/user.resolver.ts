import { Resolver, Query } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from '../../entities/user.entity';
import { ReservationType } from './reservation.resolver';
import { from, Observable } from 'rxjs';

@ObjectType()
export class UserType {
  @Field(() => ID) id: string;
  @Field() keycloak_id: string;
  @Field() email: string;
  @Field() created_at: string;
  @Field(() => [ReservationType], {
    nullable: true,
  })
  reservations: ReservationType;
}

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Query(() => [UserType])
  listUsers(): Observable<UserEntity[]> {
    return from(
      this.userRepository.find({
        relations: ['reservations', 'reservations.room'],
      }),
    );
  }
}
