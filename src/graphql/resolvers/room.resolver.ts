import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { RoomEntity } from '../../entities/room.entity';
import { ReservationType } from './reservation.resolver';
import { from, map, Observable, tap } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { CreateRoomInput } from './dto/create-room.input';

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
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  @Query(() => [RoomType])
  listRooms(
    @Args('skip') skip: number,
    @Args('limit') limit: number,
  ): Observable<RoomEntity[]> {
    return from(
      this.roomRepository.find({
        relations: ['reservations'],
        skip: skip,
        take: limit,
      }),
    );
  }

  @Query(() => RoomType, { nullable: true })
  room(@Args('id') id: string): Observable<RoomEntity> {
    return from(this.roomRepository.findOne({ where: { id } })).pipe(
      tap((room: RoomEntity) => {
        if (!room) {
          throw new NotFoundException();
        }
      }),
    );
  }

  @Mutation(() => RoomType)
  createRoom(@Args('input') input: CreateRoomInput): Observable<RoomEntity> {
    const Room = this.roomRepository.create(input);
    return this.roomRepository.save(Room);
  }

  @Mutation(() => RoomType)
  async updateRoom(
    @Args('id') id: string,
    @Args('input') input: UpdateRoomInput,
  ): Promise<RoomEntity> {
    await this.roomRepository.update(id, input);
    return this.roomRepository.findOne({ where: { id } });
  }

  @Mutation(() => Boolean)
  async deleteRoom(@Args('id') id: string): Promise<boolean> {
    const result = await this.roomRepository.delete(id);
    return result.affected > 0;
  }
}
