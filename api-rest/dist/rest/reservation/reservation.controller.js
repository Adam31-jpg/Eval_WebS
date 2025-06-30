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
exports.ReservationController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const reservation_entity_1 = require("../../entities/reservation.entity");
const reservation_service_1 = require("./reservation.service");
let ReservationController = class ReservationController {
    reservationService;
    constructor(reservationService) {
        this.reservationService = reservationService;
    }
    create(reservation) {
        return this.reservationService.create(reservation);
    }
    findAll() {
        return this.reservationService.findAll();
    }
    findOne(id) {
        return this.reservationService.findOne(+id);
    }
    update(id, updateReservationDto) {
        return this.reservationService.update(+id, updateReservationDto);
    }
    remove(id) {
        return this.reservationService.remove(+id);
    }
    grpcCreate(reservation) {
        if (typeof reservation.startTime === 'string') {
            reservation.startTime = new Date(reservation.startTime);
        }
        if (typeof reservation.endTime === 'string') {
            reservation.endTime = new Date(reservation.endTime);
        }
        if (typeof reservation.createdAt === 'string') {
            reservation.createdAt = new Date(reservation.createdAt);
        }
        return this.reservationService.create(reservation);
    }
    async grpcFindAll() {
        const reservations = await this.reservationService.findAll();
        const formattedReservations = reservations.map((res) => ({
            ...res,
            createdAt: res.createdAt?.toISOString(),
            startTime: res.startTime?.toISOString(),
            endTime: res.endTime?.toISOString(),
        }));
        return { reservations: formattedReservations };
    }
    async grpcFindOne(data) {
        const reservation = await this.reservationService.findOne(+data.id);
        return {
            ...reservation,
            createdAt: reservation.createdAt?.toISOString(),
            startTime: reservation.startTime?.toISOString(),
            endTime: reservation.endTime?.toISOString(),
        };
    }
    async grpcUpdate(data) {
        if (data.reservation.startTime &&
            typeof data.reservation.startTime === 'string') {
            data.reservation.startTime = new Date(data.reservation.startTime);
        }
        if (data.reservation.endTime &&
            typeof data.reservation.endTime === 'string') {
            data.reservation.endTime = new Date(data.reservation.endTime);
        }
        const updatedReservation = await this.reservationService.update(+data.id, data.reservation);
        return {
            ...updatedReservation,
            createdAt: updatedReservation.createdAt?.toISOString(),
            startTime: updatedReservation.startTime?.toISOString(),
            endTime: updatedReservation.endTime?.toISOString(),
        };
    }
    async grpcRemove(data) {
        await this.reservationService.remove(+data.id);
        return {};
    }
};
exports.ReservationController = ReservationController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle réservation' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Réservation créée avec succès.',
        type: reservation_entity_1.ReservationEntity,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Requête invalide.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reservation_entity_1.ReservationEntity]),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les réservations' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des réservations récupérée avec succès.',
        type: [reservation_entity_1.ReservationEntity],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une réservation par son ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la réservation' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Réservation récupérée avec succès.',
        type: reservation_entity_1.ReservationEntity,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Réservation non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une réservation' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la réservation' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Réservation mise à jour avec succès.',
        type: reservation_entity_1.ReservationEntity,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Réservation non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reservation_entity_1.ReservationEntity]),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une réservation' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la réservation' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Réservation supprimée avec succès.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Réservation non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "remove", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ReservationService', 'Create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reservation_entity_1.ReservationEntity]),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "grpcCreate", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ReservationService', 'FindAll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReservationController.prototype, "grpcFindAll", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ReservationService', 'FindOne'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReservationController.prototype, "grpcFindOne", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ReservationService', 'Update'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReservationController.prototype, "grpcUpdate", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ReservationService', 'Remove'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReservationController.prototype, "grpcRemove", null);
exports.ReservationController = ReservationController = __decorate([
    (0, swagger_1.ApiTags)('reservations'),
    (0, common_1.Controller)('reservations'),
    __metadata("design:paramtypes", [reservation_service_1.ReservationService])
], ReservationController);
//# sourceMappingURL=reservation.controller.js.map