import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API de Réservation')
    .setDescription(
      'API pour la gestion des réservations de chambres, utilisateurs et notifications',
    )
    .setVersion('1.0')
    .addTag('users', 'Opérations liées aux utilisateurs')
    .addTag('rooms', 'Opérations liées aux chambres')
    .addTag('reservations', 'Opérations liées aux réservations')
    .addTag('notifications', 'Opérations liées aux notifications')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // Interface Swagger disponible sur /api-docs

  // Configurer l'application comme un microservice gRPC
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['user', 'room', 'reservation', 'notification', 'extract'],
      protoPath: [
        join(__dirname, '../src/grpc/user/user.proto'),
        join(__dirname, '../src/grpc/room/room.proto'),
        join(__dirname, '../src/grpc/reservation/reservation.proto'),
        join(__dirname, '../src/grpc/notification/notification.proto'),
        join(__dirname, '../src/grpc/extract/extract.proto'),
      ],
      url: '0.0.0.0:50051', // Port gRPC différent du port HTTP
    },
  });

  // Démarrer les microservices et l'application HTTP
  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
