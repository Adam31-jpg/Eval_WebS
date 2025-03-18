/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { UserEntity } from '../../entities/user.entity';
import {
  defer,
  forkJoin,
  from,
  iif,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly httpService: HttpService,
  ) {}

  listUsers(skip: number, limit: number): Observable<UserEntity[]> {
    return from(
      this.userRepository.find({
        relations: ['reservations', 'reservations.room'],
        skip: skip,
        take: limit,
      }),
    );
  }

  user(id: string): Observable<UserEntity> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      tap((room: UserEntity) => {
        if (!room) {
          throw new NotFoundException();
        }
      }),
    );
  }

  getByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  createUser(user: UserEntity) {
    return defer(() => this.userRepository.save(user));
  }

  login(email: string, password: string): Observable<{ accessToken: string }> {
    return this.getKeycloakToken(email, password).pipe(
      switchMap((response) => {
        const accessToken = { accessToken: response.data.access_token };

        return this.getKeycloakUserInfo(accessToken.accessToken).pipe(
          switchMap((response) =>
            forkJoin([this.getByEmail(response.data.email), of(response.data)]),
          ),
          switchMap(([user, userInfo]: [UserEntity, any]) =>
            iif(
              () => !user,
              this.createUser({
                email: userInfo.email,
                keycloak_id: userInfo.sub,
              }),
              of(null),
            ),
          ),
          map(() => accessToken),
        );
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
