// src/graphql/resolvers/room.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { RoomEntity } from '../../entities/room.entity';
import { ReservationType } from './reservation.resolver';
import { Observable, tap, switchMap, of } from 'rxjs';
import { RoomService } from '../services/room.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gq-auth.guard';

@ObjectType()
export class RoomType {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field(() => Int) capacity: number;
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
    console.log(`🔍 GraphQL listRooms appelé avec skip: ${skip}, limit: ${limit}`);

    return this.roomService.listRooms(skip || 0, limit || 10).pipe(
      tap((rooms) => {
        console.log(`📊 GraphQL listRooms retourne ${rooms.length} rooms`);
        rooms.forEach(room => {
          console.log(`  - GraphQL Room: ID=${room.id}, Name="${room.name}"`);
        });
      })
    );
  }

  @Query(() => RoomType, { nullable: true })
  @UseGuards(GqlAuthGuard)
  room(@Args('id', { type: () => ID }) id: string): Observable<RoomEntity | null> {
    console.log(`🔍 GraphQL room appelé avec ID: ${id}`);

    return this.roomService.room(id).pipe(
      tap((room) => {
        console.log(`📋 GraphQL room résultat: ${room ? `ID=${room.id}, Name="${room.name}"` : 'null'}`);
      })
    );
  }

  @Mutation(() => RoomType)
  @UseGuards(GqlAuthGuard)
  createRoom(
    @Args('name') name: string,
    @Args('capacity', { type: () => Int }) capacity: number,
    @Args('location') location: string,
  ): Observable<RoomEntity> {
    console.log(`➕ GraphQL createRoom appelé avec:`, { name, capacity, location });

    return this.roomService.createRoom({ name, capacity, location }).pipe(
      tap((room) => {
        console.log(`✅ GraphQL createRoom terminé: ID=${room.id}, Name="${room.name}"`);
      })
    );
  }

  @Mutation(() => RoomType)
  @UseGuards(GqlAuthGuard)
  updateRoom(
    @Args('id', { type: () => ID }) id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('capacity', { type: () => Int, nullable: true }) capacity?: number,
    @Args('location', { nullable: true }) location?: string,
  ): Observable<RoomEntity> {
    console.log(`📝 GraphQL updateRoom appelé pour ID: ${id}`, { name, capacity, location });

    return this.roomService.updateRoom(id, { name, capacity, location }).pipe(
      // CORRECTION: Ajouter une vérification supplémentaire après la mise à jour
      switchMap((updatedRoom) => {
        console.log(`✅ GraphQL updateRoom terminé: ID=${updatedRoom.id}, Name="${updatedRoom.name}"`);

        // Vérifier que la room mise à jour est bien accessible
        return this.roomService.room(id).pipe(
          tap((verifiedRoom) => {
            if (verifiedRoom) {
              console.log(`✅ Vérification post-update: Room ${id} accessible avec nouvelles données`);
            } else {
              console.error(`❌ Vérification post-update: Room ${id} non accessible`);
            }
          }),
          switchMap(() => of(updatedRoom)) // Retourner la room mise à jour
        );
      })
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  deleteRoom(@Args('id', { type: () => ID }) id: string): Observable<boolean> {
    console.log(`🗑️ GraphQL deleteRoom appelé pour ID: ${id}`);

    return this.roomService.deleteRoom(id).pipe(
      tap((result) => {
        console.log(`🗑️ GraphQL deleteRoom résultat: ${result}`);
      })
    );
  }
}