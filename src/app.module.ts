import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { ReservationEntity } from './entities/reservation.entity';
import { RoomEntity } from './entities/room.entity';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
const configService = new ConfigService();
import { RestModule } from './rest/rest.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    RestModule,
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
})
export class AppModule {}
