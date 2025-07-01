import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ReservationEntity } from '../../entities/reservation.entity';
import { ExtractService } from './extract.service';
import { ExtractController } from './extract.controller';
import { ExtractClient } from './extract.client';
import { MinioService } from '../../services/minio.service';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([ReservationEntity]),
    ],
    controllers: [ExtractController],
    providers: [ExtractService, ExtractClient, MinioService],
    exports: [ExtractClient, MinioService],
})
export class ExtractModule { }