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
exports.ReservationEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const room_entity_1 = require("./room.entity");
const status_enum_1 = require("./status.enum");
const user_entity_1 = require("./user.entity");
let ReservationEntity = class ReservationEntity {
    id;
    userId;
    user;
    roomId;
    room;
    location;
    createdAt;
    validatesTimes() {
        if (this.startTime >= this.endTime) {
            throw new Error('La date de début doit être antérieure à la date de fin');
        }
    }
    startTime;
    endTime;
    status;
};
exports.ReservationEntity = ReservationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, swagger_1.ApiProperty)({
        description: 'ID unique de la réservation',
        example: '1',
    }),
    __metadata("design:type", String)
], ReservationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
    }),
    (0, swagger_1.ApiProperty)({
        description: "ID de l'utilisateur qui a fait la réservation",
        example: 1,
    }),
    __metadata("design:type", Number)
], ReservationEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.id, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, swagger_1.ApiProperty)({
        description: "Données de l'utilisateur",
        type: () => user_entity_1.UserEntity,
    }),
    __metadata("design:type", user_entity_1.UserEntity)
], ReservationEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
    }),
    (0, swagger_1.ApiProperty)({
        description: 'ID de la chambre réservée',
        example: 1,
    }),
    __metadata("design:type", Number)
], ReservationEntity.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => room_entity_1.RoomEntity, (room) => room.id),
    (0, swagger_1.ApiProperty)({
        description: 'Données de la chambre',
        type: () => room_entity_1.RoomEntity,
        required: false,
    }),
    __metadata("design:type", room_entity_1.RoomEntity)
], ReservationEntity.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, swagger_1.ApiProperty)({
        description: 'Localisation de la réservation',
        example: 'Bâtiment A, Paris',
    }),
    __metadata("design:type", String)
], ReservationEntity.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    (0, swagger_1.ApiProperty)({
        description: 'Date de création de la réservation',
        example: '2025-03-18T10:30:00Z',
    }),
    __metadata("design:type", Date)
], ReservationEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReservationEntity.prototype, "validatesTimes", null);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    (0, swagger_1.ApiProperty)({
        description: 'Date et heure de début de la réservation',
        example: '2025-04-01T14:00:00Z',
    }),
    __metadata("design:type", Date)
], ReservationEntity.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    (0, swagger_1.ApiProperty)({
        description: 'Date et heure de fin de la réservation',
        example: '2025-04-01T16:00:00Z',
    }),
    __metadata("design:type", Date)
], ReservationEntity.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, swagger_1.ApiProperty)({
        description: 'Statut de la réservation',
        enum: status_enum_1.StatusEnum,
        enumName: 'StatusEnum',
        example: status_enum_1.StatusEnum.APPROVED,
    }),
    __metadata("design:type", String)
], ReservationEntity.prototype, "status", void 0);
exports.ReservationEntity = ReservationEntity = __decorate([
    (0, typeorm_1.Entity)('reservations')
], ReservationEntity);
//# sourceMappingURL=reservation.entity.js.map