import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReservationEntity } from 'src/entities/reservation.entity';
import { ReservationService } from './reservation.service';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle réservation' })
  @ApiResponse({
    status: 201,
    description: 'Réservation créée avec succès.',
    type: ReservationEntity,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide.' })
  create(@Body() reservation: ReservationEntity) {
    return this.reservationService.create(reservation);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les réservations' })
  @ApiResponse({
    status: 200,
    description: 'Liste des réservations récupérée avec succès.',
    type: [ReservationEntity],
  })
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une réservation par son ID' })
  @ApiParam({ name: 'id', description: 'ID de la réservation' })
  @ApiResponse({
    status: 200,
    description: 'Réservation récupérée avec succès.',
    type: ReservationEntity,
  })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée.' })
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une réservation' })
  @ApiParam({ name: 'id', description: 'ID de la réservation' })
  @ApiResponse({
    status: 200,
    description: 'Réservation mise à jour avec succès.',
    type: ReservationEntity,
  })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée.' })
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: ReservationEntity,
  ) {
    return this.reservationService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une réservation' })
  @ApiParam({ name: 'id', description: 'ID de la réservation' })
  @ApiResponse({
    status: 200,
    description: 'Réservation supprimée avec succès.',
  })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée.' })
  remove(@Param('id') id: string) {
    return this.reservationService.remove(+id);
  }

  // Méthodes gRPC
  @GrpcMethod('ReservationService', 'Create')
  grpcCreate(reservation: ReservationEntity) {
    // Pour gRPC, nous devons convertir les dates de chaîne en objets Date
    if (typeof reservation.start_time === 'string') {
      reservation.start_time = new Date(reservation.start_time);
    }
    if (typeof reservation.end_time === 'string') {
      reservation.end_time = new Date(reservation.end_time);
    }
    if (typeof reservation.created_at === 'string') {
      reservation.created_at = new Date(reservation.created_at);
    }

    return this.reservationService.create(reservation);
  }

  @GrpcMethod('ReservationService', 'FindAll')
  async grpcFindAll() {
    const reservations = await this.reservationService.findAll();

    // Formater les dates pour gRPC (convertir Date en chaînes)
    const formattedReservations = reservations.map((res) => ({
      ...res,
      created_at: res.created_at?.toISOString(),
      start_time: res.start_time?.toISOString(),
      end_time: res.end_time?.toISOString(),
    }));

    return { reservations: formattedReservations };
  }

  @GrpcMethod('ReservationService', 'FindOne')
  async grpcFindOne(data: { id: string }) {
    const reservation = await this.reservationService.findOne(+data.id);

    // Formater les dates pour gRPC
    return {
      ...reservation,
      created_at: reservation.created_at?.toISOString(),
      start_time: reservation.start_time?.toISOString(),
      end_time: reservation.end_time?.toISOString(),
    };
  }

  @GrpcMethod('ReservationService', 'Update')
  async grpcUpdate(data: { id: string; reservation: ReservationEntity }) {
    // Convertir les chaînes en dates
    if (
      data.reservation.start_time &&
      typeof data.reservation.start_time === 'string'
    ) {
      data.reservation.start_time = new Date(data.reservation.start_time);
    }
    if (
      data.reservation.end_time &&
      typeof data.reservation.end_time === 'string'
    ) {
      data.reservation.end_time = new Date(data.reservation.end_time);
    }

    const updatedReservation = await this.reservationService.update(
      +data.id,
      data.reservation,
    );

    // Formater les dates pour gRPC
    return {
      ...updatedReservation,
      created_at: updatedReservation.created_at?.toISOString(),
      start_time: updatedReservation.start_time?.toISOString(),
      end_time: updatedReservation.end_time?.toISOString(),
    };
  }

  @GrpcMethod('ReservationService', 'Remove')
  async grpcRemove(data: { id: string }) {
    await this.reservationService.remove(+data.id);
    return {};
  }
}
