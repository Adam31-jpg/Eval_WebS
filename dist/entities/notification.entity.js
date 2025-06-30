"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const reservation_entity_1 = require("./reservation.entity");
let NotificationEntity = class NotificationEntity {
    id;
    reservationId;
    reservation;
    message;
    notificationDate;
    isSent;
};
exports.NotificationEntity = NotificationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, swagger_1.ApiProperty)({
        description: 'ID unique de la notification',
        example: '1',
    }),
    __metadata("design:type", String)
], NotificationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
    }),
    (0, swagger_1.ApiProperty)({
        description: 'ID de la réservation associée',
        example: 1,
    }),
    __metadata("design:type", Number)
], NotificationEntity.prototype, "reservationId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_1.ReservationEntity, (reservation) => reservation.id),
    (0, swagger_1.ApiProperty)({
        description: 'Données de la réservation',
        type: () => reservation_entity_1.ReservationEntity,
        required: false,
    }),
    __metadata("design:type", reservation_entity_1.ReservationEntity)
], NotificationEntity.prototype, "reservation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, swagger_1.ApiProperty)({
        description: 'Message de la notification',
        example: 'Votre réservation a été confirmée',
    }),
    __metadata("design:type", String)
], NotificationEntity.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    (0, swagger_1.ApiProperty)({
        description: 'Date de la notification',
        example: '2025-03-18T10:30:00Z',
    }),
    __metadata("design:type", Date)
], NotificationEntity.prototype, "notificationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    (0, swagger_1.ApiProperty)({
        description: 'Indique si la notification a été envoyée',
        example: false,
    }),
    __metadata("design:type", Boolean)
], NotificationEntity.prototype, "isSent", void 0);
exports.NotificationEntity = NotificationEntity = __decorate([
    (0, typeorm_1.Entity)('notifications')
], NotificationEntity);
//# sourceMappingURL=notification.entity.js.map