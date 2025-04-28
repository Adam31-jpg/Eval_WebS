import { Resolver, Query, Args, ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';
import { ReservationType } from './reservation.resolver';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gq-auth.guard';

@ObjectType()
export class accessTokenType {
  @Field() accessToken: string;
}
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
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserType])
  @UseGuards(GqlAuthGuard)
  listUsers(
    @Args('skip') skip: number,
    @Args('limit') limit: number,
  ): Observable<UserEntity[]> {
    return this.userService.listUsers(skip, limit);
  }

  @Query(() => UserType, { nullable: true })
  @UseGuards(GqlAuthGuard)
  room(@Args('id') id: string): Observable<UserEntity> {
    return this.userService.user(id);
  }

  @Query(() => accessTokenType)
  login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Observable<{ accessToken: string }> {
    return this.userService.login(email, password);
  }
}
