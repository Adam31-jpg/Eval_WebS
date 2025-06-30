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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const notification_entity_1 = require("../../entities/notification.entity");
const notification_service_1 = require("./notification.service");
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    findAll() {
        return this.notificationService.findAll();
    }
    findOne(id) {
        return this.notificationService.findOne(+id);
    }
    create(createNotificationDto) {
        return this.notificationService.create(createNotificationDto);
    }
    update(id, updateNotificationDto) {
        return this.notificationService.update(+id, updateNotificationDto);
    }
    remove(id) {
        return this.notificationService.remove(+id);
    }
    grpcCreate(data) {
        try {
            console.log('request', data);
            const request = data;
            if (!request.reservationId || !request.message) {
                throw new Error('reservationId et message sont requis');
            }
            const notification = new notification_entity_1.NotificationEntity();
            notification.reservationId = request.reservationId;
            notification.message = request.message;
            notification.notificationDate = request.notificationDate
                ? new Date(request.notificationDate)
                : new Date();
            notification.isSent =
                request.isSent !== undefined ? request.isSent : false;
            return this.notificationService.create(notification);
        }
        catch (error) {
            console.error('Erreur lors de la création de la notification:', error);
            throw new Error('Erreur lors de la création de la notification');
        }
    }
    async grpcFindAll() {
        const notifications = await this.notificationService.findAll();
        const formattedNotifications = notifications.map((notif) => ({
            ...notif,
            notificationDate: notif.notificationDate?.toISOString(),
        }));
        return { notifications: formattedNotifications };
    }
    async grpcFindOne(data) {
        const notification = await this.notificationService.findOne(+data.id);
        if (!notification) {
            return null;
        }
        return {
            ...notification,
            notificationDate: notification.notificationDate?.toISOString(),
        };
    }
    async grpcUpdate(data) {
        if (data.notification.notificationDate &&
            typeof data.notification.notificationDate === 'string') {
            data.notification.notificationDate = new Date(data.notification.notificationDate);
        }
        await this.notificationService.update(+data.id, data.notification);
        const updatedNotification = await this.notificationService.findOne(+data.id);
        if (!updatedNotification) {
            return null;
        }
        return {
            ...updatedNotification,
            notificationDate: updatedNotification.notificationDate?.toISOString(),
        };
    }
    async grpcRemove(data) {
        await this.notificationService.remove(+data.id);
        return {};
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les notifications' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des notifications récupérée avec succès.',
        type: [notification_entity_1.NotificationEntity],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une notification par son ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la notification' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notification récupérée avec succès.',
        type: notification_entity_1.NotificationEntity,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle notification' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Notification créée avec succès.',
        type: notification_entity_1.NotificationEntity,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Requête invalide.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_entity_1.NotificationEntity]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une notification' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la notification' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notification mise à jour avec succès.',
        type: notification_entity_1.NotificationEntity,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, notification_entity_1.NotificationEntity]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une notification' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la notification' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notification supprimée avec succès.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "remove", null);
__decorate([
    (0, microservices_1.GrpcMethod)('NotificationService', 'Create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "grpcCreate", null);
__decorate([
    (0, microservices_1.GrpcMethod)('NotificationService', 'FindAll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "grpcFindAll", null);
__decorate([
    (0, microservices_1.GrpcMethod)('NotificationService', 'FindOne'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "grpcFindOne", null);
__decorate([
    (0, microservices_1.GrpcMethod)('NotificationService', 'Update'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "grpcUpdate", null);
__decorate([
    (0, microservices_1.GrpcMethod)('NotificationService', 'Remove'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "grpcRemove", null);
exports.NotificationController = NotificationController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map