import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { switchMap, forkJoin, of, map } from 'rxjs';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../graphql/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  login(email: string, password: string) {
    return this.getKeycloakToken(email, password).pipe(
      switchMap((response) =>
        this.getKeycloakUserInfo(response.data.access_token),
      ),
      switchMap((response) =>
        forkJoin([
          this.userService.getByEmail(response.data.email),
          of(response.data),
        ]),
      ),
      switchMap(([user, userInfo]: [UserEntity, any]) => {
        if (!user) {
          return this.userService.createUser({
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
