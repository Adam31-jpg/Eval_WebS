import { OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';
interface Reservation {
    id: string;
    user_id: number;
    room_id: number;
    location: string;
    created_at: string;
    start_time: string;
    end_time: string;
    status: string;
}
interface Empty {
}
interface Reservations {
    reservations: Reservation[];
}
export declare class ReservationClient implements OnModuleInit {
    private reservationService;
    private client;
    onModuleInit(): void;
    createReservation(reservation: Reservation): Observable<Reservation>;
    findAllReservations(): Observable<Reservations>;
    findOneReservation(id: string): Observable<Reservation>;
    updateReservation(id: string, reservation: Reservation): Observable<Reservation>;
    removeReservation(id: string): Observable<Empty>;
}
export {};
