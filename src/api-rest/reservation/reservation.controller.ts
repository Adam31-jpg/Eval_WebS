import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param, Post,
  Put
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReservationEntity } from 'src/entities/reservation.entity';
import { ReservationService } from './reservation.service';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle réservation' })
  @ApiResponse({
    status: 201,
    description: 'Réservation créée avec succès.',
    type: ReservationEntity,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide.' })
  create(@Body() reservation: ReservationEntity) {
    console.log('reservation', reservation);
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

  @Put(':id')
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
    @Body() updateReservationDto: Partial<ReservationEntity>,
  ) {
    return this.reservationService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // AJOUTER CETTE LIGNE
  @ApiOperation({ summary: 'Supprimer une réservation' })
  @ApiParam({ name: 'id', description: 'ID de la réservation' })
  @ApiResponse({
    status: 204, // CHANGER de 200 à 204
    description: 'Réservation supprimée avec succès.',
  })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée.' })
  async remove(@Param('id') id: string) { // AJOUTER async
    await this.reservationService.remove(+id); // AJOUTER await
    // Ne pas retourner de contenu pour un 204
  }

  // Méthodes gRPC
  @GrpcMethod('ReservationService', 'Create')
  grpcCreate(reservation: ReservationEntity) {
    // Pour gRPC, nous devons convertir les dates de chaîne en objets Date
    if (typeof reservation.startTime === 'string') {
      reservation.startTime = new Date(reservation.startTime);
    }
    if (typeof reservation.endTime === 'string') {
      reservation.endTime = new Date(reservation.endTime);
    }
    if (typeof reservation.createdAt === 'string') {
      reservation.createdAt = new Date(reservation.createdAt);
    }

    return this.reservationService.create(reservation);
  }

  @GrpcMethod('ReservationService', 'FindAll')
  async grpcFindAll() {
    const reservations = await this.reservationService.findAll();

    // Formater les dates pour gRPC (convertir Date en chaînes)
    const formattedReservations = reservations.map((res) => ({
      ...res,
      createdAt: res.createdAt?.toISOString(),
      startTime: res.startTime?.toISOString(),
      endTime: res.endTime?.toISOString(),
    }));

    return { reservations: formattedReservations };
  }

  @GrpcMethod('ReservationService', 'FindOne')
  async grpcFindOne(data: { id: string }) {
    const reservation = await this.reservationService.findOne(+data.id);

    // Formater les dates pour gRPC
    return {
      ...reservation,
      createdAt: reservation.createdAt?.toISOString(),
      startTime: reservation.startTime?.toISOString(),
      endTime: reservation.endTime?.toISOString(),
    };
  }

  @GrpcMethod('ReservationService', 'Update')
  async grpcUpdate(data: { id: string; reservation: ReservationEntity }) {
    // Convertir les chaînes en dates
    if (
      data.reservation.startTime &&
      typeof data.reservation.startTime === 'string'
    ) {
      data.reservation.startTime = new Date(data.reservation.startTime);
    }
    if (
      data.reservation.endTime &&
      typeof data.reservation.endTime === 'string'
    ) {
      data.reservation.endTime = new Date(data.reservation.endTime);
    }

    const updatedReservation = await this.reservationService.update(
      +data.id,
      data.reservation,
    );

    // Formater les dates pour gRPC
    return {
      ...updatedReservation,
      createdAt: updatedReservation.createdAt?.toISOString(),
      startTime: updatedReservation.startTime?.toISOString(),
      endTime: updatedReservation.endTime?.toISOString(),
    };
  }

  @GrpcMethod('ReservationService', 'Remove')
  async grpcRemove(data: { id: string }) {
    await this.reservationService.remove(+data.id);
    return {};
  }
}
