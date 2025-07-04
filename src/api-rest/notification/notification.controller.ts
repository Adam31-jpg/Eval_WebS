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


  @GrpcMethod('NotificationService', 'CreateNotification')
  async grpcCreateNotification(data: any) {
    const saved = await this.notificationService.create(data);

    return {
      id: saved.id.toString(),
      reservationId: saved.reservationId.toString(),
      message: saved.message,
      notificationDate: saved.notificationDate.toISOString(),
      isSent: saved.isSent,
    };
  }

  @GrpcMethod('NotificationService', 'GetNotification')
  async grpcGetNotification(data: any) {
    const notification = await this.notificationService.findOne(+data.id);

    return {
      id: (notification?.id ?? '').toString(),
      reservationId: parseInt((notification?.reservationId ?? '0').toString()),
      message: notification?.message ?? '',
      notificationDate: notification?.notificationDate ? notification.notificationDate.toISOString() : null,
      isSent: notification?.isSent ?? false,
    };
  }

  @GrpcMethod('NotificationService', 'UpdateNotification')
  async grpcUpdateNotification(data: any) {
    await this.notificationService.update(+data.id, {
      message: data.message,
      notificationDate: new Date(data.notificationDate),
      isSent: true,
    } as any);

    const updated = await this.notificationService.findOne(+data.id);

    return {
      id: updated?.id.toString(),
      reservationId: parseInt((updated?.reservationId ?? '0').toString()),
      message: updated?.message,
      notificationDate: updated?.notificationDate.toISOString(),
      isSent: updated?.isSent,
    };
  }

  @GrpcMethod('NotificationService', 'Remove')
  async grpcRemove(data: { id: string }) {
    await this.notificationService.remove(+data.id);
    return {};
  }
}
