"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API de Réservation')
        .setDescription('API pour la gestion des réservations de chambres, utilisateurs et notifications')
        .setVersion('1.0')
        .addTag('users', 'Opérations liées aux utilisateurs')
        .addTag('rooms', 'Opérations liées aux chambres')
        .addTag('reservations', 'Opérations liées aux réservations')
        .addTag('notifications', 'Opérations liées aux notifications')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: ['user', 'room', 'reservation', 'notification'],
            protoPath: [
                (0, path_1.join)(__dirname, '../src/grpc/user/user.proto'),
                (0, path_1.join)(__dirname, '../src/grpc/room/room.proto'),
                (0, path_1.join)(__dirname, '../src/grpc/reservation/reservation.proto'),
                (0, path_1.join)(__dirname, '../src/grpc/notification/notification.proto'),
            ],
            url: '0.0.0.0:50051',
        },
    });
    await app.startAllMicroservices();
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map