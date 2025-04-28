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
import { NotificationEntity } from 'src/entities/notification.entity';
import { NotificationService } from './notification.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les notifications' })
  @ApiResponse({
    status: 200,
    description: 'Liste des notifications récupérée avec succès.',
    type: [NotificationEntity],
  })
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une notification par son ID' })
  @ApiParam({ name: 'id', description: 'ID de la notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification récupérée avec succès.',
    type: NotificationEntity,
  })
  @ApiResponse({ status: 404, description: 'Notification non trouvée.' })
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification créée avec succès.',
    type: NotificationEntity,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide.' })
  create(@Body() createNotificationDto: NotificationEntity) {
    return this.notificationService.create(createNotificationDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une notification' })
  @ApiParam({ name: 'id', description: 'ID de la notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification mise à jour avec succès.',
    type: NotificationEntity,
  })
  @ApiResponse({ status: 404, description: 'Notification non trouvée.' })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: NotificationEntity,
  ) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une notification' })
  @ApiParam({ name: 'id', description: 'ID de la notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification supprimée avec succès.',
  })
  @ApiResponse({ status: 404, description: 'Notification non trouvée.' })
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }

  // Méthodes gRPC
  @GrpcMethod('NotificationService', 'Create')
  grpcCreate(data: {
    reservationId: number;
    message: string;
    notificationDate: string;
    isSent: boolean;
  }) {
    try {
      console.log('request', data);
      const request = data;
      // Vérifiez que toutes les propriétés nécessaires sont présentes
      if (!request.reservationId || !request.message) {
        throw new Error('reservationId et message sont requis');
      }

      const notification = new NotificationEntity();
      notification.reservationId = request.reservationId;
      notification.message = request.message;
      notification.notificationDate = request.notificationDate
        ? new Date(request.notificationDate)
        : new Date();
      notification.isSent =
        request.isSent !== undefined ? request.isSent : false;

      return this.notificationService.create(notification);
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
      throw new Error('Erreur lors de la création de la notification');
    }
  }
  @GrpcMethod('NotificationService', 'FindAll')
  async grpcFindAll() {
    const notifications = await this.notificationService.findAll();

    // Formater les dates pour gRPC
    const formattedNotifications = notifications.map((notif) => ({
      ...notif,
      notificationDate: notif.notificationDate?.toISOString(),
    }));

    return { notifications: formattedNotifications };
  }

  @GrpcMethod('NotificationService', 'FindOne')
  async grpcFindOne(data: { id: string }) {
    const notification = await this.notificationService.findOne(+data.id);

    if (!notification) {
      return null;
    }

    // Formater les dates pour gRPC
    return {
      ...notification,
      notificationDate: notification.notificationDate?.toISOString(),
    };
  }

  @GrpcMethod('NotificationService', 'Update')
  async grpcUpdate(data: { id: string; notification: NotificationEntity }) {
    // Convertir les chaînes en dates
    if (
      data.notification.notificationDate &&
      typeof data.notification.notificationDate === 'string'
    ) {
      data.notification.notificationDate = new Date(
        data.notification.notificationDate,
      );
    }

    await this.notificationService.update(+data.id, data.notification);
    const updatedNotification = await this.notificationService.findOne(
      +data.id,
    );

    if (!updatedNotification) {
      return null;
    }

    // Formater les dates pour gRPC
    return {
      ...updatedNotification,
      notificationDate: updatedNotification.notificationDate?.toISOString(),
    };
  }

  @GrpcMethod('NotificationService', 'Remove')
  async grpcRemove(data: { id: string }) {
    await this.notificationService.remove(+data.id);
    return {};
  }
}
