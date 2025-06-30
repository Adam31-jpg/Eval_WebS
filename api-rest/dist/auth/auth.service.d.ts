import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
export declare class AuthService {
    private readonly userRepository;
    private readonly httpService;
    constructor(userRepository: Repository<UserEntity>, httpService: HttpService);
    login(email: string, password: string): Observable<{
        accessToken: any;
    }>;
    private createUser;
    private getByEmail;
    private getKeycloakUserInfo;
    private getKeycloakToken;
}
