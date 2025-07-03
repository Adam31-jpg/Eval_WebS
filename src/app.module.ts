import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { ReservationEntity } from './entities/reservation.entity';
import { RoomEntity } from './entities/room.entity';
import { UserEntity } from './entities/user.entity';
import { NotificationClient } from './grpc-service/notification/notification.client';
import { NotificationController } from './api-rest/notification/notification.controller';
import { NotificationService } from './api-rest/notification/notification.service';
import { ReservationController } from './api-rest/reservation/reservation.controller';
import { ReservationService } from './api-rest/reservation/reservation.service';
import { RoomController } from './api-rest/room/room.controller';
import { RoomService } from './api-rest/room/room.service';
import { UserController } from './api-rest/user/user.controller';
import { UserService } from './api-rest/user/user.service';
import { GraphQLAppModule } from './api-graphql/graphql.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExtractClient } from './grpc-service/extract/extract.client';
import { MinioService } from './services/minio.service';
import { ExtractController } from './grpc-service/extract/extract.controller';
import { ExtractService } from './grpc-service/extract/extract.service';
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
    TypeOrmModule.forFeature([NotificationEntity, ReservationEntity, UserEntity, RoomEntity]),
  ],
  controllers: [
    UserController,
    RoomController,
    ReservationController,
    NotificationController,
    ExtractController,
  ],
  providers: [
    UserService,
    RoomService,
    ReservationService,
    NotificationService,
    NotificationClient,
    ExtractClient,
    ExtractService,
    MinioService,
  ],
})
export class AppModule { }
