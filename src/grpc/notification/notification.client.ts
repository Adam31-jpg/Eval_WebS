// src/clients/notification.client.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Observable } from 'rxjs';

interface NotificationService {
  Create(data: CreateNotificationRequest): Observable<Notification>;
  Update(updateNotificationRequest: any): Observable<any>;
}

interface CreateNotificationRequest {
  reservationId: number;
  message: string;
  notificationDate: string;
  isSent: boolean;
}

@Injectable()
export class NotificationClient implements OnModuleInit {
  private notificationService: NotificationService;

  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'notification',
      protoPath: join(__dirname, './notification.proto'),
      url: 'localhost:50051',
    },
  })
  private client: ClientGrpc;

  onModuleInit() {
    this.notificationService = this.client.getService<NotificationService>(
      'NotificationService',
    );
  }

  createNotification(notification: any): Observable<any> {
    console.log('Envoi de notification:', notification);
    return this.notificationService.Create(notification);
  }

  updateNotification(id: string, notification: any): Observable<any> {
    return this.notificationService.Update({ id, notification });
  }
}
