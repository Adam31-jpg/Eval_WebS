import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Observable } from 'rxjs';

// Interfaces qui correspondent aux messages définis dans le proto
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

interface Empty { }

interface ReservationById {
    id: string;
}

interface UpdateReservationRequest {
    id: string;
    reservation: Reservation;
}

interface Reservations {
    reservations: Reservation[];
}

// Interface du service qui correspond aux méthodes rpc définies dans le proto
interface ReservationService {
    Create(data: Reservation): Observable<Reservation>;
    FindAll(empty: Empty): Observable<Reservations>;
    FindOne(data: ReservationById): Observable<Reservation>;
    Update(data: UpdateReservationRequest): Observable<Reservation>;
    Remove(data: ReservationById): Observable<Empty>;
}

@Injectable()
export class ReservationClient implements OnModuleInit {
    private reservationService: ReservationService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'reservation', // nom du package dans le fichier proto
            protoPath: join(__dirname, './reservation.proto'), // chemin vers le fichier proto
            url: 'localhost:50052', // URL du serveur gRPC (à ajuster selon votre configuration)
        },
    })
    private client: ClientGrpc;

    onModuleInit() {
        this.reservationService = this.client.getService<ReservationService>(
            'ReservationService', // nom du service dans le fichier proto
        );
    }

    createReservation(reservation: Reservation): Observable<Reservation> {
        return this.reservationService.Create(reservation);
    }

    findAllReservations(): Observable<Reservations> {
        return this.reservationService.FindAll({});
    }

    findOneReservation(id: string): Observable<Reservation> {
        return this.reservationService.FindOne({ id });
    }

    updateReservation(id: string, reservation: Reservation): Observable<Reservation> {
        return this.reservationService.Update({ id, reservation });
    }

    removeReservation(id: string): Observable<Empty> {
        return this.reservationService.Remove({ id });
    }
}