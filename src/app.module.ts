import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { ReservationEntity } from './entities/reservation.entity';
import { UserEntity } from './entities/user.entity';
import { RoomEntity } from './entities/room.entity';

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
  controllers: [],
  providers: [],
})
export class AppModule {}
