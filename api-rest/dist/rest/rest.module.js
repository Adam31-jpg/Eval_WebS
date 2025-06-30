"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestModule = void 0;
const common_1 = require("@nestjs/common");
const notification_controller_1 = require("./notification/notification.controller");
const notification_service_1 = require("./notification/notification.service");
const reservation_controller_1 = require("./reservation/reservation.controller");
const reservation_service_1 = require("./reservation/reservation.service");
const room_controller_1 = require("./room/room.controller");
const room_service_1 = require("./room/room.service");
const user_controller_1 = require("./user/user.controller");
const user_service_1 = require("./user/user.service");
const typeorm_1 = require("@nestjs/typeorm");
const notification_entity_1 = require("../entities/notification.entity");
const reservation_entity_1 = require("../entities/reservation.entity");
const room_entity_1 = require("../entities/room.entity");
const user_entity_1 = require("../entities/user.entity");
const notification_client_1 = require("../grpc/notification/notification.client");
let RestModule = class RestModule {
};
exports.RestModule = RestModule;
exports.RestModule = RestModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                notification_entity_1.NotificationEntity,
                reservation_entity_1.ReservationEntity,
                user_entity_1.UserEntity,
                room_entity_1.RoomEntity,
            ]),
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
], RestModule);
//# sourceMappingURL=rest.module.js.map