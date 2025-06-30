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
exports.NotificationClient = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
let NotificationClient = class NotificationClient {
    notificationService;
    client;
    onModuleInit() {
        this.notificationService = this.client.getService('NotificationService');
    }
    createNotification(notification) {
        console.log('Envoi de notification:', notification);
        return this.notificationService.Create(notification);
    }
    updateNotification(id, notification) {
        return this.notificationService.Update({ id, notification });
    }
};
exports.NotificationClient = NotificationClient;
__decorate([
    (0, microservices_1.Client)({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'notification',
            protoPath: (0, path_1.join)(__dirname, './notification.proto'),
            url: 'localhost:50051',
        },
    }),
    __metadata("design:type", Object)
], NotificationClient.prototype, "client", void 0);
exports.NotificationClient = NotificationClient = __decorate([
    (0, common_1.Injectable)()
], NotificationClient);
//# sourceMappingURL=notification.client.js.map