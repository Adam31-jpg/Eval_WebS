"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const reservation_entity_1 = require("./entities/reservation.entity");
const room_entity_1 = require("./entities/room.entity");
const user_entity_1 = require("./entities/user.entity");
const notification_client_1 = require("./grpc/notification/notification.client");
const notification_controller_1 = require("./rest/notification/notification.controller");
const notification_service_1 = require("./rest/notification/notification.service");
const reservation_controller_1 = require("./rest/reservation/reservation.controller");
const reservation_service_1 = require("./rest/reservation/reservation.service");
const room_controller_1 = require("./rest/room/room.controller");
const room_service_1 = require("./rest/room/room.service");
const user_controller_1 = require("./rest/user/user.controller");
const user_service_1 = require("./rest/user/user.service");
const graphql_module_1 = require("./graphql/graphql.module");
const auth_module_1 = require("./auth/auth.module");
const config_1 = require("@nestjs/config");
const configService = new config_1.ConfigService();
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            auth_module_1.AuthModule,
            graphql_module_1.GraphQLAppModule,
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USER'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: [notification_entity_1.NotificationEntity, reservation_entity_1.ReservationEntity, user_entity_1.UserEntity, room_entity_1.RoomEntity],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, room_entity_1.RoomEntity, reservation_entity_1.ReservationEntity, notification_entity_1.NotificationEntity]),
        ],
        controllers: [
            user_controller_1.UserController,
            room_controller_1.RoomController,
            reservation_controller_1.ReservationController,
            notification_controller_1.NotificationController,
        ],
        providers: [
            user_service_1.UserService,
            room_service_1.RoomService,
            reservation_service_1.ReservationService,
            notification_service_1.NotificationService,
            notification_client_1.NotificationClient,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map