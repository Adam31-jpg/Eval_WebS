import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Observable } from 'rxjs';

interface ExtractService {
    GenerateUserExtract(data: { user_id: number }): Observable<{ url: string }>;
}

@Injectable()
export class ExtractClient implements OnModuleInit {
    private readonly logger = new Logger(ExtractClient.name);
    private extractService: ExtractService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'extract',
            protoPath: join(__dirname, './extract.proto'),
            url: 'localhost:50051',
        },
    })
    private client: ClientGrpc;

    onModuleInit() {
        this.extractService = this.client.getService<ExtractService>('ExtractService');
        this.logger.log('ExtractClient initialisé');
    }

    generateUserExtract(userId: number): Observable<{ url: string }> {
        this.logger.log(`Appel gRPC pour générer l'extraction de l'utilisateur ${userId}`);
        return this.extractService.GenerateUserExtract({ user_id: userId });
    }

    ExportReservations(data: { userId: number }, callback: (err: any, response?: { url: string }) => void) {
        this.logger.log(`Appel gRPC legacy pour l'extraction de l'utilisateur ${data.userId}`);
        this.extractService.GenerateUserExtract({ user_id: data.userId }).subscribe({
            next: (response) => callback(null, response),
            error: (error) => callback(error)
        });
    }
}