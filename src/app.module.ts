import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { ReservationEntity } from './entities/reservation.entity';
import { RoomEntity } from './entities/room.entity';
import { UserEntity } from './entities/user.entity';
import { NotificationClient } from './grpc/notification/notification.client';
import { NotificationController } from './rest/notification/notification.controller';
import { NotificationService } from './rest/notification/notification.service';
import { ReservationController } from './rest/reservation/reservation.controller';
import { ReservationService } from './rest/reservation/reservation.service';
import { RoomController } from './rest/room/room.controller';
import { RoomService } from './rest/room/room.service';
import { UserController } from './rest/user/user.controller';
import { UserService } from './rest/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'pguser',
      password: 'pgpass',
      database: 'pgdb',
      entities: [NotificationEntity, ReservationEntity, UserEntity, RoomEntity],
      synchronize: true,
    }),
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
export class AppModule {}
