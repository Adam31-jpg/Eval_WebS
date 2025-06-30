import { UserEntity } from '../../entities/user.entity';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { AuthService } from '../../auth/auth.service';
export declare class UserService {
    private readonly userRepository;
    private readonly authService;
    constructor(userRepository: Repository<UserEntity>, authService: AuthService);
    listUsers(skip: number, limit: number): Observable<UserEntity[]>;
    user(id: string): Observable<UserEntity>;
    createUser(user: UserEntity): Observable<UserEntity>;
    login(email: string, password: string): Observable<{
        accessToken: string;
    }>;
}
