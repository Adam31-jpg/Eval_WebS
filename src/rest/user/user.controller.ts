import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GrpcMethod } from '@nestjs/microservices';
import { ApiOperation, ApiParam, ApiResponse, ApiTags, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserEntity } from '../../entities/user.entity';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès.',
    type: UserEntity,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide.' })
  @ApiResponse({ status: 401, description: 'Token manquant ou invalide.' })
  @ApiResponse({ status: 403, description: 'Droits insuffisants.' })
  async create(@Body() user: any) {
    try {
      // Simuler la vérification des droits
      // En mode mock, on accepte les tokens qui commencent par 'mock-admin'
      // Dans un vrai environnement, vous vérifieriez les rôles JWT

      const newUser = {
        email: user.email,
        keycloakId: user.keycloakId || `kc_${Date.now()}`,
      };

      return this.userService.create(newUser);
    } catch (error) {
      console.error('Erreur lors de la création utilisateur:', error);
      throw error;
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs récupérée avec succès.',
    type: [UserEntity],
  })
  async findAll(
    @Query('skip') skip: string = '0',
    @Query('limit') limit: string = '10'
  ) {
    const users = await this.userService.findAll(Number(skip), Number(limit));
    return { users };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis à jour avec succès.',
    type: UserEntity,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  update(@Param('id') id: string, @Body() user: Partial<UserEntity>) {
    return this.userService.update(+id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiResponse({
    status: 204,
    description: 'Utilisateur supprimé avec succès.',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  async remove(@Param('id') id: string) {
    await this.userService.remove(+id);
  }

  // Méthodes gRPC inchangées...
  @GrpcMethod('UserService', 'Create')
  async grpcCreate(user: any) {
    console.log('gRPC Create - données reçues:', JSON.stringify(user));

    const keycloakId = user.keycloak_id || user.keycloakId;

    if (!keycloakId) {
      throw new Error('keycloak_id est obligatoire');
    }

    const newUser: any = {
      keycloakId: keycloakId,
      email: user.email,
      createdAt: user.created_at || user.createdAt ? new Date(user.created_at || user.createdAt) : new Date(),
    };

    console.log('gRPC Create - données à sauvegarder:', JSON.stringify(newUser));
    return this.userService.create(newUser);
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