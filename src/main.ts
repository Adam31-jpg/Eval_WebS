import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
