import { ReservationEntity } from '../../entities/reservation.entity';
import { Observable } from 'rxjs';
import { CreateReservationInput } from '../resolvers/dto/create-reservation.input';
import { Repository } from 'typeorm';
export declare class ReservationService {
    private readonly reservationRepository;
    constructor(reservationRepository: Repository<ReservationEntity>);
    listReservations(skip: number, limit: number): Observable<ReservationEntity[]>;
    reservation(id: string): Observable<ReservationEntity>;
    createReservation(reservationDto: CreateReservationInput): Observable<ReservationEntity>;
    updateReservation(id: string, input: CreateReservationInput): Observable<ReservationEntity>;
    deleteReservation(id: string): Observable<boolean>;
}
