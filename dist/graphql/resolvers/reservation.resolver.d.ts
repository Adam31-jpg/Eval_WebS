import { ReservationEntity } from '../../entities/reservation.entity';
import { StatusEnum } from '../../entities/status.enum';
import { RoomType } from './room.resolver';
import { UserType } from './user.resolver';
import { Observable } from 'rxjs';
import { CreateReservationInput } from './dto/create-reservation.input';
import { ReservationService } from '../services/reservation.service';
export declare class ReservationType {
    id: string;
    start_time: string;
    end_time: string;
    status: StatusEnum;
    location: string;
    created_at: string;
    room: RoomType;
    user: UserType;
}
export declare class ReservationResolver {
    private readonly reservationService;
    constructor(reservationService: ReservationService);
    listReservations(skip: number, limit: number): Observable<ReservationEntity[]>;
    room(id: string): Observable<ReservationEntity>;
    createReservation(input: CreateReservationInput): Observable<ReservationEntity>;
    updateRoom(id: string, input: CreateReservationInput): Observable<ReservationEntity>;
    deleteRoom(id: string): Observable<boolean>;
}
