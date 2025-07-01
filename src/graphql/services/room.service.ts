// src/graphql/services/room.service.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../../entities/room.entity';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) { }

  listRooms(skip: number, limit: number): Observable<RoomEntity[]> {
    return from(
      this.roomRepository.find({
        // relations: ['reservations'],
        skip: skip,
        take: limit,
      }),
    );
  }

  room(id: string): Observable<RoomEntity> {
    return from(this.roomRepository.findOne({ where: { id } })).pipe(
      tap((room: RoomEntity) => {
        if (!room) {
          throw new NotFoundException();
        }
      }),
    );
  }

  createRoom(room: { name: string; capacity: number; location?: string }): Observable<RoomEntity> {
    return from(this.roomRepository.save(this.roomRepository.create(room)));
  }

  updateRoom(id: string, input: { name?: string; capacity?: number; location?: string }): Observable<RoomEntity> {
    return this.room(id).pipe(
      switchMap(() => this.roomRepository.update(id, input)),
      switchMap(() => this.roomRepository.findOneOrFail({ where: { id } })),
    );
  }

  deleteRoom(id: string): Observable<boolean> {
    return from(this.roomRepository.delete(id)).pipe(
      map((result) => (result.affected ? result.affected > 0 : false)),
    );
  }
}