// src/graphql/resolvers/room.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { RoomEntity } from '../../entities/room.entity';
import { ReservationType } from './reservation.resolver';
import { Observable } from 'rxjs';
import { RoomService } from '../services/room.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gq-auth.guard';

@ObjectType()
export class RoomType {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field(() => Int) capacity: number; // Changé en Int
  @Field() location: string;
  @Field() created_at: string;
  @Field(() => [ReservationType], { nullable: true })
  reservations: ReservationType[];
}

@Resolver(() => RoomType)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) { }

  @Query(() => [RoomType])
  @UseGuards(GqlAuthGuard)
  listRooms(
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('limit', { type: () => Int, nullable: true }) limit: number,
  ): Observable<RoomEntity[]> {
    return this.roomService.listRooms(skip || 0, limit || 10);
  }

  @Query(() => RoomType, { nullable: true })
  @UseGuards(GqlAuthGuard)
  room(@Args('id', { type: () => ID }) id: string): Observable<RoomEntity | null> {
    return this.roomService.room(id);
  }

  @Mutation(() => RoomType)
  @UseGuards(GqlAuthGuard)
  createRoom(
    @Args('name') name: string,
    @Args('capacity', { type: () => Int }) capacity: number,
    @Args('location') location: string,
  ): Observable<RoomEntity> {
    return this.roomService.createRoom({ name, capacity, location });
  }

  @Mutation(() => RoomType)
  @UseGuards(GqlAuthGuard)
  updateRoom(
    @Args('id', { type: () => ID }) id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('capacity', { type: () => Int, nullable: true }) capacity?: number,
    @Args('location', { nullable: true }) location?: string,
  ): Observable<RoomEntity> {
    return this.roomService.updateRoom(id, { name, capacity, location });
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  deleteRoom(@Args('id', { type: () => ID }) id: string): Observable<boolean> {
    return this.roomService.deleteRoom(id);
  }
}