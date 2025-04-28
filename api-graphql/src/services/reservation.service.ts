import { Injectable, NotFoundException } from '@nestjs/common';
import { ReservationEntity } from '../entities/reservation.entity';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import { CreateReservationInput } from '../resolvers/dto/create-reservation.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
  ) {}

  listReservations(
    skip: number,
    limit: number,
  ): Observable<ReservationEntity[]> {
    return from(
      this.reservationRepository.find({ relations: [], skip, take: limit }),
    );
  }

  reservation(id: string): Observable<ReservationEntity> {
    return from(this.reservationRepository.findOne({ where: { id } })).pipe(
      tap((reservation: ReservationEntity) => {
        if (!reservation) {
          throw new NotFoundException();
        }
      }),
    );
  }

  createReservation(
    reservationDto: CreateReservationInput,
  ): Observable<ReservationEntity> {
    return from(
      this.reservationRepository.save(
        this.reservationRepository.create(reservationDto),
      ),
    );
  }

  updateReservation(
    id: string,
    input: CreateReservationInput,
  ): Observable<ReservationEntity> {
    return this.reservation(id).pipe(
      switchMap(() => this.reservationRepository.update(id, input)),
      switchMap(() =>
        this.reservationRepository.findOneOrFail({ where: { id } }),
      ),
    );
  }

  deleteReservation(id: string): Observable<boolean> {
    return from(this.reservationRepository.delete(id)).pipe(
      map((result) => (result.affected ? result.affected > 0 : false)),
    );
  }
}
