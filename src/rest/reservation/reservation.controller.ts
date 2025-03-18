import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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
}
