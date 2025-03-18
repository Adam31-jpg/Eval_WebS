import { UserEntity } from '../../entities/user.entity';
import { from, Observable, of, tap } from 'rxjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  login(email: string, password: string): Observable<{ accessToken: string }> {
    return of({ accessToken: 'test' });
  }
}
