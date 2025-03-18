import { UserEntity } from '../../entities/user.entity';
import { Observable } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserResolver {
  constructor() {}

  login(): Observable<UserEntity[]> {
    this.userRepository.find({
      relations: ['reservations', 'reservations.room'],
    });
  }
}
