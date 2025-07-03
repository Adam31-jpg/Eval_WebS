// src/graphql/services/room.service.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../../entities/room.entity';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
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
        skip: skip || 0,
        take: limit || 10,
        order: { createdAt: 'DESC' },
      }),
    );
  }

  room(id: string): Observable<RoomEntity | null> {
    return from(this.roomRepository.findOne({ where: { id } })).pipe(
      map((room: RoomEntity | null) => {
        return room;
      }),
      catchError(() => {
        return of(null);
      })
    );
  }

  createRoom(room: { name: string; capacity: number; location?: string }): Observable<RoomEntity> {
    return from(this.roomRepository.save(this.roomRepository.create(room)));
  }

  updateRoom(id: string, input: { name?: string; capacity?: number; location?: string }): Observable<RoomEntity> {
    return this.room(id).pipe(
      switchMap((existingRoom) => {
        if (!existingRoom) {
          throw new NotFoundException(`Room with ID ${id} not found`);
        }

        // CORRECTION: Utiliser save() au lieu de update() pour forcer un refresh
        const updatedRoom = { ...existingRoom, ...input };
        return from(this.roomRepository.save(updatedRoom));
      }),
      catchError((error) => {
        console.error('❌ Erreur lors de la mise à jour de la room:', error);
        throw error;
      })
    );
  }

  deleteRoom(id: string): Observable<boolean> {
    return from(this.roomRepository.delete(id)).pipe(
      map((result) => (result.affected ? result.affected > 0 : false)),
    );
  }
}