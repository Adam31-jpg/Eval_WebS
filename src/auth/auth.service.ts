import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { switchMap, forkJoin, of, map, Observable, from, defer } from 'rxjs';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly httpService: HttpService,
  ) {}

  login(email: string, password: string) {
    return this.getKeycloakToken(email, password).pipe(
      switchMap((responseToken) =>
        this.getKeycloakUserInfo(responseToken.data.access_token).pipe(
          switchMap((responseUserInfo) =>
            forkJoin([
              this.getByEmail(responseUserInfo.data.email),
              of(responseUserInfo.data),
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

          map(() => {
            console.log(responseToken.data.access_token);
            return { accessToken: responseToken.data.access_token };
          }),
        ),
      ),
    );
  }

  private createUser(user: UserEntity) {
    console.log('gggggg');
    return defer(() => this.userRepository.save(user));
  }

  private getByEmail(email: string): Observable<UserEntity> {
    console.log('iiii');
    return from(
      this.userRepository.findOneOrFail({
        where: { email },
      }),
    );
  }

  private getKeycloakUserInfo(accessToken: string) {
    console.log('uuuu');
    return this.httpService.get(
      'http://localhost:8080/realms/myrealm/protocol/openid-connect/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
  }

  private getKeycloakToken(username: string, password: string) {
    console.log('ffff');
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
