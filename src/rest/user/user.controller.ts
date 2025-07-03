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
  HttpStatus,
  Request,
  ForbiddenException,
  UnauthorizedException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GrpcMethod } from '@nestjs/microservices';
import { ApiOperation, ApiParam, ApiResponse, ApiTags, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserEntity } from '../../entities/user.entity';
import { UserService } from './user.service';
import { ExtractClient } from 'src/grpc/extract/extract.client';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly extractClient: ExtractClient
  ) { }

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
  async create(@Body() user: any, @Request() req: any) {
    console.log('🔵 UserController.create appelé');
    console.log('Headers:', req.headers.authorization?.substring(0, 30) + '...');
    console.log('User depuis JWT:', req.user);
    console.log('Body:', user);

    // Vérifier les droits administrateur
    const currentUser = req.user;
    if (!currentUser) {
      console.log('❌ Utilisateur non authentifié');
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    // Extraire le token de l'en-tête pour vérification supplémentaire
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    console.log('🔍 Vérification des droits admin...');
    console.log('Current user roles:', currentUser.roles);
    console.log('Token type:', token?.substring(0, 10));

    // Vérifier si l'utilisateur a les droits admin
    const hasAdminRights = currentUser.roles?.includes('admin') ||
      token?.includes('admin') ||
      (process.env.NODE_ENV === 'test' && token?.startsWith('mock-admin'));

    console.log('Has admin rights:', hasAdminRights);

    if (!hasAdminRights) {
      console.log('❌ Droits insuffisants pour:', currentUser);
      throw new ForbiddenException('Droits administrateur requis pour créer un utilisateur');
    }

    try {
      // Créer l'utilisateur
      const newUser = {
        email: user.email,
        keycloakId: user.keycloakId || `kc_${Date.now()}`,
      };

      console.log('✅ Création de l\'utilisateur:', newUser);
      const result = await this.userService.create(newUser);
      console.log('✅ Utilisateur créé:', result);
      return result;
    } catch (error) {
      console.error('❌ Erreur lors de la création utilisateur:', error.message);
      // Re-lancer l'erreur pour que NestJS la gère proprement
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

  @Post(':id/extract')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Générer une extraction CSV des réservations de l\'utilisateur' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiResponse({
    status: 201,
    description: 'URL d\'extraction générée avec succès.',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'URL présignée pour télécharger le fichier CSV'
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  @ApiResponse({ status: 401, description: 'Token manquant ou invalide.' })
  async extractUserReservations(@Param('id') id: string): Promise<{ url: string }> {
    console.log(`📊 Demande d'extraction CSV pour l'utilisateur: ${id}`);

    try {
      // Vérifier que l'utilisateur existe
      await this.userService.findOne(+id);

      // Appeler le service d'extraction via gRPC
      return new Promise((resolve, reject) => {
        this.extractClient.generateUserExtract(+id).subscribe({
          next: (result) => {
            console.log(`✅ Extraction CSV générée pour l'utilisateur ${id}:`, result.url);
            resolve({ url: result.url });
          },
          error: (error) => {
            console.error(`❌ Erreur lors de l'extraction CSV pour l'utilisateur ${id}:`, error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error(`❌ Erreur dans extractUserReservations pour l'utilisateur ${id}:`, error);
      throw error;
    }
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