import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ReservationEntity } from './entities/reservation.entity';
import { RoomEntity } from './entities/room.entity';
import { UserEntity } from './entities/user.entity';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReservationResolver } from './resolvers/reservation.resolver';
import { RoomResolver } from './resolvers/room.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { ReservationService } from './services/reservation.service';
import { RoomService } from './services/room.service';
import { UserService } from './services/user.service';
const configService = new ConfigService();

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    HttpModule,
    TypeOrmModule.forFeature([ReservationEntity, UserEntity, RoomEntity]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      entities: [ReservationEntity, UserEntity, RoomEntity],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),
  ],
  providers: [
    ReservationService,
    UserService,
    RoomService,
    ReservationResolver,
    UserResolver,
    RoomResolver,
  ],
})
export class AppModule {}
