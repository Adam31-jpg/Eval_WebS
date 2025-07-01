import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationEntity } from '../../entities/reservation.entity';
import { MinioService } from '../../services/minio.service';

@Injectable()
export class ExtractService {
    private readonly logger = new Logger(ExtractService.name);

    constructor(
        @InjectRepository(ReservationEntity)
        private readonly reservationRepository: Repository<ReservationEntity>,
        private readonly minioService: MinioService,
    ) { }

    async generateUserExtract(userId: number): Promise<string> {
        try {
            this.logger.log(`Génération de l'extraction pour l'utilisateur ${userId}`);

            // 1. Récupérer toutes les réservations de l'utilisateur
            const reservations = await this.reservationRepository.find({
                where: { userId },
                relations: ['room'], // Inclure les informations de la room si nécessaire
                order: { createdAt: 'DESC' },
            });

            this.logger.log(`${reservations.length} réservations trouvées pour l'utilisateur ${userId}`);

            // 2. Générer le contenu CSV
            const csvContent = this.generateCsvContent(reservations);

            // 3. Créer le nom de fichier unique
            const timestamp = Date.now();
            const fileName = `extracts/user_${userId}_${timestamp}.csv`;

            // 4. Uploader le fichier vers MinIO
            await this.minioService.uploadCsvFile(fileName, csvContent);

            // 5. Générer l'URL présignée
            const presignedUrl = await this.minioService.getPresignedUrl(fileName, 3600); // 1 heure

            this.logger.log(`Extraction générée avec succès pour l'utilisateur ${userId}: ${fileName}`);
            return presignedUrl;

        } catch (error) {
            this.logger.error(`Erreur lors de la génération de l'extraction pour l'utilisateur ${userId}:`, error);
            throw error;
        }
    }

    private generateCsvContent(reservations: ReservationEntity[]): string {
        // En-têtes CSV
        const headers = [
            'reservation_id',
            'user_id',
            'room_id',
            'start_time',
            'end_time',
            'status',
            'location',
            'created_at'
        ];

        // Convertir les réservations en lignes CSV
        const rows = reservations.map(reservation => [
            reservation.id,
            reservation.userId,
            reservation.roomId,
            reservation.startTime instanceof Date
                ? reservation.startTime.toISOString()
                : reservation.startTime,
            reservation.endTime instanceof Date
                ? reservation.endTime.toISOString()
                : reservation.endTime,
            reservation.status,
            reservation.location || '',
            reservation.createdAt instanceof Date
                ? reservation.createdAt.toISOString()
                : reservation.createdAt
        ]);

        // Assembler le CSV
        const csvLines = [
            headers.join(','), // Ligne d'en-têtes
            ...rows.map(row => row.map(cell => `"${cell}"`).join(',')) // Lignes de données avec guillemets
        ];

        return csvLines.join('\n');
    }

    async cleanupOldExtracts(olderThanHours: number = 24): Promise<void> {
        try {
            this.logger.log(`Nettoyage des extractions anciennes (> ${olderThanHours}h)`);

            const files = await this.minioService.listCsvFiles();
            const cutoffTime = Date.now() - (olderThanHours * 60 * 60 * 1000);

            for (const fileName of files) {
                // Extraire le timestamp du nom de fichier
                const timestampMatch = fileName.match(/user_\d+_(\d+)\.csv$/);
                if (timestampMatch) {
                    const fileTimestamp = parseInt(timestampMatch[1]);
                    if (fileTimestamp < cutoffTime) {
                        await this.minioService.deleteCsvFile(fileName);
                        this.logger.log(`Fichier ancien supprimé: ${fileName}`);
                    }
                }
            }
        } catch (error) {
            this.logger.error('Erreur lors du nettoyage des anciens extraits:', error);
        }
    }
}