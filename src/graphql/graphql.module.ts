import { Module } from '@nestjs/common';
import { ReservationService } from './services/reservation.service';
import { UserService } from './services/user.service';
import { RoomService } from './services/room.service';
import { ReservationResolver } from './resolvers/reservation.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { RoomResolver } from './resolvers/room.resolver';
import { HttpModule } from '@nestjs/axios';
import { NotificationEntity } from '../entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationEntity } from '../entities/reservation.entity';
import { RoomEntity } from '../entities/room.entity';
import { UserEntity } from '../entities/user.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      NotificationEntity,
      ReservationEntity,
      UserEntity,
      RoomEntity,
    ]),
  ],
  controllers: [],
  providers: [
    ReservationService,
    UserService,
    RoomService,
    ReservationResolver,
    UserResolver,
    RoomResolver,
  ],
})
export class GraphQLAppModule {}
