import { UserEntity } from '../../entities/user.entity';
import { defer, from, Observable, tap } from 'rxjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  listUsers(skip: number, limit: number): Observable<UserEntity[]> {
    return from(
      this.userRepository.find({
        relations: ['reservations', 'reservations.room'],
        skip,
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

  createUser(user: UserEntity): Observable<UserEntity> {
    return defer(() => this.userRepository.save(user));
  }

  login(email: string, password: string): Observable<{ accessToken: string }> {
    return this.authService.login(email, password);
  }
}
