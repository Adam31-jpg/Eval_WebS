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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../entities/user.entity");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    create(user) {
        return this.userService.create(user);
    }
    findAll() {
        return this.userService.findAll();
    }
    findOne(id) {
        return this.userService.findOne(+id);
    }
    update(id, user) {
        return this.userService.update(+id, user);
    }
    remove(id) {
        return this.userService.remove(+id);
    }
    async grpcCreate(user) {
        console.log('gRPC Create - données reçues:', JSON.stringify(user));
        const keycloakId = user.keycloak_id || user.keycloakId;
        if (!keycloakId) {
            throw new Error('keycloak_id est obligatoire');
        }
        const newUser = {
            keycloakId: keycloakId,
            email: user.email,
            createdAt: user.created_at || user.createdAt ? new Date(user.created_at || user.createdAt) : new Date(),
        };
        console.log('gRPC Create - données à sauvegarder:', JSON.stringify(newUser));
        return this.userService.create(newUser);
    }
    async grpcFindAll() {
        const users = await this.userService.findAll();
        return { users };
    }
    grpcFindOne(data) {
        return this.userService.findOne(+data.id);
    }
    grpcUpdate(data) {
        return this.userService.update(+data.id, data.user);
    }
    async grpcRemove(data) {
        await this.userService.remove(+data.id);
        return {};
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouvel utilisateur' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Utilisateur créé avec succès.',
        type: user_entity_1.UserEntity,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Requête invalide.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les utilisateurs' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des utilisateurs récupérée avec succès.',
        type: [user_entity_1.UserEntity],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un utilisateur par son ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'utilisateur" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Utilisateur récupéré avec succès.',
        type: user_entity_1.UserEntity,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Utilisateur non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un utilisateur' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'utilisateur" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Utilisateur mis à jour avec succès.',
        type: user_entity_1.UserEntity,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Utilisateur non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un utilisateur' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: "ID de l'utilisateur" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Utilisateur supprimé avec succès.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Utilisateur non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "remove", null);
__decorate([
    (0, microservices_1.GrpcMethod)('UserService', 'Create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "grpcCreate", null);
__decorate([
    (0, microservices_1.GrpcMethod)('UserService', 'FindAll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "grpcFindAll", null);
__decorate([
    (0, microservices_1.GrpcMethod)('UserService', 'FindOne'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "grpcFindOne", null);
__decorate([
    (0, microservices_1.GrpcMethod)('UserService', 'Update'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "grpcUpdate", null);
__decorate([
    (0, microservices_1.GrpcMethod)('UserService', 'Remove'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "grpcRemove", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map