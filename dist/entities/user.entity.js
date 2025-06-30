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
exports.UserEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let UserEntity = class UserEntity {
    id;
    keycloakId;
    email;
    createdAt;
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, swagger_1.ApiProperty)({
        description: "ID unique de l'utilisateur",
        example: '1',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', unique: true }),
    (0, swagger_1.ApiProperty)({
        description: "ID keycloak de l'utilisateur",
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "keycloakId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', unique: true }),
    (0, swagger_1.ApiProperty)({
        description: "Adresse email de l'utilisateur",
        example: 'user@example.com',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    (0, swagger_1.ApiProperty)({
        description: 'Date de création du compte',
        example: '2025-03-18T10:30:00Z',
    }),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)('users')
], UserEntity);
//# sourceMappingURL=user.entity.js.map