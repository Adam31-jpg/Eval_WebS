import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ExtractService } from './extract.service';

interface GenerateUserExtractRequest {
    user_id: number;
}

interface GenerateUserExtractResponse {
    url: string;
}

@Controller()
export class ExtractController {
    private readonly logger = new Logger(ExtractController.name);

    constructor(private readonly extractService: ExtractService) { }

    @GrpcMethod('ExtractService', 'GenerateUserExtract')
    async generateUserExtract(data: GenerateUserExtractRequest): Promise<GenerateUserExtractResponse> {
        this.logger.log(`Demande d'extraction gRPC pour l'utilisateur ${data.user_id}`);

        try {
            const url = await this.extractService.generateUserExtract(data.user_id);
            this.logger.log(`Extraction générée avec succès via gRPC pour l'utilisateur ${data.user_id}`);
            return { url };
        } catch (error) {
            this.logger.error(`Erreur lors de l'extraction gRPC pour l'utilisateur ${data.user_id}:`, error);
            throw error;
        }
    }

    @GrpcMethod('ExtractService', 'ExportReservations')
    async exportReservations(data: { userId: number }): Promise<GenerateUserExtractResponse> {
        this.logger.log(`Legacy export pour l'utilisateur ${data.userId}`);

        try {
            const url = await this.extractService.generateUserExtract(data.userId);
            this.logger.log(`Export legacy généré avec succès pour l'utilisateur ${data.userId}`);
            return { url };
        } catch (error) {
            this.logger.error(`Erreur lors de l'export legacy pour l'utilisateur ${data.userId}:`, error);
            throw error;
        }
    }
}