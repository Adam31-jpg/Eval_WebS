import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly minioClient: Minio.Client;
  private readonly bucketName = 'reservations-csv';

  constructor(private configService: ConfigService) {
    // CORRECTION: Convertir les variables d'environnement en types appropriés
    const useSSL = this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true';
    const port = parseInt(this.configService.get<string>('MINIO_PORT', '9000'), 10);
    const endpoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    const accessKey = this.configService.get<string>('MINIO_ROOT_USER', 'minioadmin');
    const secretKey = this.configService.get<string>('MINIO_ROOT_PASSWORD', 'minioadmin');
    
    this.logger.log('Configuration MinIO:', {
      endPoint: endpoint,
      port: port,
      useSSL: useSSL,
      accessKey: accessKey,
    });

    this.minioClient = new Minio.Client({
      endPoint: endpoint,
      port: port,
      useSSL: useSSL, // CORRECTION: Boolean converti depuis string
      accessKey: accessKey,
      secretKey: secretKey,
    });

    this.initializeBucket();
  }

  private async initializeBucket() {
    try {
      const bucketExists = await this.minioClient.bucketExists(this.bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(this.bucketName);
        this.logger.log(`Bucket '${this.bucketName}' créé avec succès`);
      } else {
        this.logger.log(`Bucket '${this.bucketName}' existe déjà`);
      }
    } catch (error) {
      this.logger.error('Erreur lors de l\'initialisation du bucket:', error);
    }
  }

  async uploadCsvFile(fileName: string, csvContent: string): Promise<string> {
    try {
      const buffer = Buffer.from(csvContent, 'utf8');
      
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        buffer,
        buffer.length,
        {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        }
      );

      this.logger.log(`Fichier CSV uploadé: ${fileName}`);
      return fileName;
    } catch (error) {
      this.logger.error('Erreur lors de l\'upload du fichier CSV:', error);
      throw error;
    }
  }

  async getPresignedUrl(fileName: string, expiry: number = 300): Promise<string> {
    try {
      const presignedUrl = await this.minioClient.presignedGetObject(
        this.bucketName,
        fileName,
        expiry // 5 minutes par défaut
      );

      // CORRECTION: Pour Docker, remplacer l'endpoint interne par localhost
      const externalUrl = this.convertToExternalUrl(presignedUrl);
      
      this.logger.log(`URL présignée générée pour: ${fileName}`);
      return externalUrl;
    } catch (error) {
      this.logger.error('Erreur lors de la génération de l\'URL présignée:', error);
      throw error;
    }
  }

  private convertToExternalUrl(internalUrl: string): string {
    // Convertir les URLs internes Docker (minio:9000) en URLs externes (localhost:9000)
    const minioInternalHost = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    const minioExternalHost = this.configService.get<string>('MINIO_EXTERNAL_ENDPOINT', 'localhost');
    const minioExternalPort = this.configService.get<string>('MINIO_EXTERNAL_PORT', '9000');
    
    return internalUrl
      .replace(`${minioInternalHost}:9000`, `${minioExternalHost}:${minioExternalPort}`)
      .replace('minio:9000', `localhost:9000`); // Fallback pour Docker
  }

  async deleteCsvFile(fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, fileName);
      this.logger.log(`Fichier CSV supprimé: ${fileName}`);
    } catch (error) {
      this.logger.error('Erreur lors de la suppression du fichier CSV:', error);
      throw error;
    }
  }

  async listCsvFiles(): Promise<string[]> {
    try {
      const objects: string[] = [];
      const stream = this.minioClient.listObjects(this.bucketName, '', true);
      
      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          if (obj.name) {
            objects.push(obj.name);
          }
        });
        
        stream.on('end', () => {
          this.logger.log(`${objects.length} fichiers trouvés dans le bucket`);
          resolve(objects);
        });
        
        stream.on('error', (error) => {
          this.logger.error('Erreur lors du listage des fichiers:', error);
          reject(error);
        });
      });
    } catch (error) {
      this.logger.error('Erreur lors du listage des fichiers CSV:', error);
      throw error;
    }
  }
}