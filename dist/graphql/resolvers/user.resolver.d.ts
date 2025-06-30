import { UserEntity } from '../../entities/user.entity';
import { ReservationType } from './reservation.resolver';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
export declare class accessTokenType {
    accessToken: string;
}
export declare class UserType {
    id: string;
    keycloak_id: string;
    email: string;
    created_at: string;
    reservations: ReservationType;
}
export declare class UserResolver {
    private readonly userService;
    constructor(userService: UserService);
    listUsers(skip: number, limit: number): Observable<UserEntity[]>;
    room(id: string): Observable<UserEntity>;
    login(email: string, password: string): Observable<{
        accessToken: string;
    }>;
}
