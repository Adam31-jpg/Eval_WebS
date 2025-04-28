import { Module } from '@nestjs/common';

import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';
import { ReservationController } from './reservation/reservation.controller';
import { ReservationService } from './reservation/reservation.service';
import { RoomController } from './room/room.controller';
import { RoomService } from './room/room.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { ReservationEntity } from '../entities/reservation.entity';
import { RoomEntity } from '../entities/room.entity';
import { UserEntity } from '../entities/user.entity';
import { NotificationClient } from '../grpc/notification/notification.client';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationEntity,
      ReservationEntity,
      UserEntity,
      RoomEntity,
    ]),
  ],

  controllers: [
    UserController,
    RoomController,
    ReservationController,
    NotificationController,
  ],
  providers: [
    UserService,
    RoomService,
    ReservationService,
    NotificationService,
    NotificationClient,
  ],
})
export class RestModule {}
