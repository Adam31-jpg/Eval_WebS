import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { switchMap, forkJoin, of, map, Observable, from, defer } from 'rxjs';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  login(email: string, password: string) {
    return this.getKeycloakToken(email, password).pipe(
      switchMap((response) =>
        this.getKeycloakUserInfo(response.data.access_token),
      ),
      switchMap((response) =>
        forkJoin([
          this.getByEmail(response.data.email as string),
          of(response.data),
        ]),
      ),
      switchMap(([user, userInfo]: [UserEntity, any]) => {
        if (!user) {
          return this.createUser({
            email: userInfo.email,
            keycloak_id: userInfo.sub,
          });
        }

        return of(user);
      }),

      map((user: UserEntity) => ({
        accessToken: this.jwtService.sign({
          username: user.email,
          sub: user.id,
        }),
      })),
    );
  }

  private createUser(user: UserEntity) {
    return defer(() => this.userRepository.save(user));
  }

  private getByEmail(email: string): Observable<UserEntity> {
    return from(
      this.userRepository.findOneOrFail({
        where: { email },
      }),
    );
  }

  private getKeycloakUserInfo(accessToken: string) {
    return this.httpService.get(
      'http://localhost:8080/realms/myrealm/protocol/openid-connect/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
  }

  private getKeycloakToken(username: string, password: string) {
    return this.httpService.post(
      'http://localhost:8080/realms/myrealm/protocol/openid-connect/token',
      {
        grant_type: 'password',
        client_id: 'myclient',
        client_secret: 'mysecret',
        scope: 'openid profile',
        username,
        password,
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
  }
}
