import {
  Body,
  Controller,
  Delete,
  Get,
  Param, Post,
  Query,
  HttpCode,
  HttpStatus,
  Put
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ApiOperation, ApiParam, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { RoomEntity } from 'src/entities/room.entity';
import { RoomService } from './room.service';

@ApiTags('rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle chambre' })
  @ApiResponse({
    status: 201,
    description: 'Chambre créée avec succès.',
    type: RoomEntity,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide.' })
  create(@Body() room: RoomEntity) {
    return this.roomService.create(room);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les chambres' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Liste des chambres récupérée avec succès.',
    type: [RoomEntity],
  })
  async findAll(
    @Query('skip') skip: string = '0',
    @Query('limit') limit: string = '10'
  ) {
    const rooms = await this.roomService.findAll(Number(skip), Number(limit));
    // Retourner la structure attendue par les tests
    return { rooms };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une chambre par son ID' })
  @ApiParam({ name: 'id', description: 'ID de la chambre' })
  @ApiResponse({
    status: 200,
    description: 'Chambre récupérée avec succès.',
    type: RoomEntity,
  })
  @ApiResponse({ status: 404, description: 'Chambre non trouvée.' })
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une chambre' })
  @ApiParam({ name: 'id', description: 'ID de la chambre' })
  @ApiResponse({
    status: 200,
    description: 'Chambre mise à jour avec succès.',
    type: RoomEntity,
  })
  @ApiResponse({ status: 404, description: 'Chambre non trouvée.' })
  update(@Param('id') id: string, @Body() room: Partial<RoomEntity>) {
    return this.roomService.update(+id, room);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Force le statut 204
  @ApiOperation({ summary: 'Supprimer une chambre' })
  @ApiParam({ name: 'id', description: 'ID de la chambre' })
  @ApiResponse({ status: 204, description: 'Chambre supprimée avec succès.' })
  @ApiResponse({ status: 404, description: 'Chambre non trouvée.' })
  async remove(@Param('id') id: string) {
    await this.roomService.remove(+id);
    // Ne pas retourner de contenu pour un 204
  }

  // Méthodes gRPC inchangées...
  @GrpcMethod('RoomService', 'Create')
  grpcCreate(room: RoomEntity) {
    return this.roomService.create(room);
  }

  @GrpcMethod('RoomService', 'FindAll')
  async grpcFindAll() {
    const rooms = await this.roomService.findAll();
    return { rooms };
  }

  @GrpcMethod('RoomService', 'FindOne')
  grpcFindOne(data: { id: string }) {
    return this.roomService.findOne(+data.id);
  }

  @GrpcMethod('RoomService', 'Update')
  grpcUpdate(data: { id: string; room: RoomEntity }) {
    return this.roomService.update(+data.id, data.room);
  }

  @GrpcMethod('RoomService', 'Remove')
  async grpcRemove(data: { id: string }) {
    await this.roomService.remove(+data.id);
    return {};
  }
}