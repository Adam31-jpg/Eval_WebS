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
import { UserEntity } from '../../entities/user.entity';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès.',
    type: UserEntity,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide.' })
  create(@Body() user: UserEntity) {
    return this.userService.create(user);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs récupérée avec succès.',
    type: [UserEntity],
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par son ID' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur récupéré avec succès.',
    type: UserEntity,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis à jour avec succès.',
    type: UserEntity,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  update(@Param('id') id: string, @Body() user: UserEntity) {
    return this.userService.update(+id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur supprimé avec succès.',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  // Méthodes gRPC
  @GrpcMethod('UserService', 'Create')
  grpcCreate(user: UserEntity) {
    return this.userService.create(user);
  }

  @GrpcMethod('UserService', 'FindAll')
  async grpcFindAll() {
    const users = await this.userService.findAll();
    return { users };
  }

  @GrpcMethod('UserService', 'FindOne')
  grpcFindOne(data: { id: string }) {
    return this.userService.findOne(+data.id);
  }

  @GrpcMethod('UserService', 'Update')
  grpcUpdate(data: { id: string; user: UserEntity }) {
    return this.userService.update(+data.id, data.user);
  }

  @GrpcMethod('UserService', 'Remove')
  async grpcRemove(data: { id: string }) {
    await this.userService.remove(+data.id);
    return {};
  }
}
