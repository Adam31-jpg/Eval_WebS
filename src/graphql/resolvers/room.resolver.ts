import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { RoomEntity } from '../../entities/room.entity';
import { ReservationType } from './reservation.resolver';
import { Observable } from 'rxjs';
import { CreateRoomInput } from './dto/create-room.input';
import { RoomService } from '../services/room.service';

@ObjectType()
export class RoomType {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field() capacity: string;
  @Field() location: string;
  @Field() created_at: string;
  @Field(() => [ReservationType], {
    nullable: true,
  })
  reservations: ReservationType[];
}

@Resolver(() => RoomType)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @Query(() => [RoomType])
  listRooms(
    @Args('skip') skip: number,
    @Args('limit') limit: number,
  ): Observable<RoomEntity[]> {
    return this.roomService.listRooms(skip, limit);
  }

  @Query(() => RoomType, { nullable: true })
  room(@Args('id') id: string): Observable<RoomEntity> {
    return this.roomService.room(id);
  }

  @Mutation(() => RoomType)
  createRoom(@Args('input') input: CreateRoomInput): Observable<RoomEntity> {
    return this.roomService.createRoom(input);
  }

  @Mutation(() => RoomType)
  updateRoom(
    @Args('id') id: string,
    @Args('input') input: CreateRoomInput,
  ): Observable<RoomEntity> {
    return this.roomService.updateRoom(id, input);
  }

  @Mutation(() => Boolean)
  deleteRoom(@Args('id') id: string): Observable<boolean> {
    return this.roomService.deleteRoom(id);
  }
}
