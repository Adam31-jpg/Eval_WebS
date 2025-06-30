import { OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class NotificationClient implements OnModuleInit {
    private notificationService;
    private client;
    onModuleInit(): void;
    createNotification(notification: any): Observable<any>;
    updateNotification(id: string, notification: any): Observable<any>;
}
