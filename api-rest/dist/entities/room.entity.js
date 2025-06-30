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
exports.RoomEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let RoomEntity = class RoomEntity {
    id;
    name;
    capacity;
    location;
    createdAt;
};
exports.RoomEntity = RoomEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, swagger_1.ApiProperty)({
        description: 'ID unique de la chambre',
        example: '1',
    }),
    __metadata("design:type", String)
], RoomEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
    }),
    (0, swagger_1.ApiProperty)({
        description: 'Nom de la chambre',
        example: 'Suite Royale',
    }),
    __metadata("design:type", String)
], RoomEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, nullable: false }),
    (0, swagger_1.ApiProperty)({
        description: 'Capacité de la chambre (nombre de personnes)',
        example: '4',
    }),
    __metadata("design:type", Number)
], RoomEntity.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, swagger_1.ApiProperty)({
        description: 'Localisation de la chambre',
        example: 'Aile Est, 3ème étage',
    }),
    __metadata("design:type", String)
], RoomEntity.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    }),
    (0, swagger_1.ApiProperty)({
        description: 'Date de création',
        example: '2025-03-18T10:30:00Z',
    }),
    __metadata("design:type", Date)
], RoomEntity.prototype, "createdAt", void 0);
exports.RoomEntity = RoomEntity = __decorate([
    (0, typeorm_1.Entity)('rooms')
], RoomEntity);
//# sourceMappingURL=room.entity.js.map