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
exports.ReservationClient = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
let ReservationClient = class ReservationClient {
    reservationService;
    client;
    onModuleInit() {
        this.reservationService = this.client.getService('ReservationService');
    }
    createReservation(reservation) {
        return this.reservationService.Create(reservation);
    }
    findAllReservations() {
        return this.reservationService.FindAll({});
    }
    findOneReservation(id) {
        return this.reservationService.FindOne({ id });
    }
    updateReservation(id, reservation) {
        return this.reservationService.Update({ id, reservation });
    }
    removeReservation(id) {
        return this.reservationService.Remove({ id });
    }
};
exports.ReservationClient = ReservationClient;
__decorate([
    (0, microservices_1.Client)({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'reservation',
            protoPath: (0, path_1.join)(__dirname, './reservation.proto'),
            url: 'localhost:50052',
        },
    }),
    __metadata("design:type", Object)
], ReservationClient.prototype, "client", void 0);
exports.ReservationClient = ReservationClient = __decorate([
    (0, common_1.Injectable)()
], ReservationClient);
//# sourceMappingURL=reservation.client.js.map