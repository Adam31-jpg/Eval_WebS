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
import { GraphQLAppModule } from './graphql/graphql.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
const configService = new ConfigService();
@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    GraphQLAppModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      entities: [NotificationEntity, ReservationEntity, UserEntity, RoomEntity],
      synchronize: true,
    }),
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
export class AppModule { }
