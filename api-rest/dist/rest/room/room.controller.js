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
exports.RoomController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const room_entity_1 = require("../../entities/room.entity");
const room_service_1 = require("./room.service");
let RoomController = class RoomController {
    roomService;
    constructor(roomService) {
        this.roomService = roomService;
    }
    create(room) {
        return this.roomService.create(room);
    }
    findAll() {
        return this.roomService.findAll();
    }
    findOne(id) {
        return this.roomService.findOne(+id);
    }
    update(id, room) {
        return this.roomService.update(+id, room);
    }
    remove(id) {
        return this.roomService.remove(+id);
    }
    grpcCreate(room) {
        return this.roomService.create(room);
    }
    async grpcFindAll() {
        const rooms = await this.roomService.findAll();
        return { rooms };
    }
    grpcFindOne(data) {
        return this.roomService.findOne(+data.id);
    }
    grpcUpdate(data) {
        return this.roomService.update(+data.id, data.room);
    }
    async grpcRemove(data) {
        await this.roomService.remove(+data.id);
        return {};
    }
};
exports.RoomController = RoomController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle chambre' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Chambre créée avec succès.',
        type: room_entity_1.RoomEntity,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Requête invalide.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [room_entity_1.RoomEntity]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les chambres' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des chambres récupérée avec succès.',
        type: [room_entity_1.RoomEntity],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une chambre par son ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la chambre' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chambre récupérée avec succès.',
        type: room_entity_1.RoomEntity,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chambre non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une chambre' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la chambre' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chambre mise à jour avec succès.',
        type: room_entity_1.RoomEntity,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chambre non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, room_entity_1.RoomEntity]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une chambre' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la chambre' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chambre supprimée avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chambre non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "remove", null);
__decorate([
    (0, microservices_1.GrpcMethod)('RoomService', 'Create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [room_entity_1.RoomEntity]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "grpcCreate", null);
__decorate([
    (0, microservices_1.GrpcMethod)('RoomService', 'FindAll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "grpcFindAll", null);
__decorate([
    (0, microservices_1.GrpcMethod)('RoomService', 'FindOne'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "grpcFindOne", null);
__decorate([
    (0, microservices_1.GrpcMethod)('RoomService', 'Update'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "grpcUpdate", null);
__decorate([
    (0, microservices_1.GrpcMethod)('RoomService', 'Remove'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "grpcRemove", null);
exports.RoomController = RoomController = __decorate([
    (0, swagger_1.ApiTags)('rooms'),
    (0, common_1.Controller)('rooms'),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], RoomController);
//# sourceMappingURL=room.controller.js.map