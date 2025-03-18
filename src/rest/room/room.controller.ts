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
import { RoomEntity } from 'src/entities/room.entity';
import { RoomService } from './room.service';

@ApiTags('rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

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
  @ApiResponse({
    status: 200,
    description: 'Liste des chambres récupérée avec succès.',
    type: [RoomEntity],
  })
  findAll() {
    return this.roomService.findAll();
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

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une chambre' })
  @ApiParam({ name: 'id', description: 'ID de la chambre' })
  @ApiResponse({
    status: 200,
    description: 'Chambre mise à jour avec succès.',
    type: RoomEntity,
  })
  @ApiResponse({ status: 404, description: 'Chambre non trouvée.' })
  update(@Param('id') id: string, @Body() room: RoomEntity) {
    return this.roomService.update(+id, room);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une chambre' })
  @ApiParam({ name: 'id', description: 'ID de la chambre' })
  @ApiResponse({ status: 200, description: 'Chambre supprimée avec succès.' })
  @ApiResponse({ status: 404, description: 'Chambre non trouvée.' })
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}
