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
exports.ReservationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reservation_entity_1 = require("../../entities/reservation.entity");
const status_enum_1 = require("../../entities/status.enum");
const typeorm_2 = require("typeorm");
const notification_client_1 = require("../../grpc/notification/notification.client");
let ReservationService = class ReservationService {
    reservationRepository;
    notificationClient;
    constructor(reservationRepository, notificationClient) {
        this.reservationRepository = reservationRepository;
        this.notificationClient = notificationClient;
    }
    async create(reservation) {
        const savedReservation = await this.reservationRepository.save(reservation);
        const notificationRequest = {
            reservationId: parseInt(savedReservation.id),
            message: `Nouvelle réservation créée pour la chambre ${savedReservation.roomId}`,
            notificationDate: new Date().toISOString(),
            isSent: false,
        };
        console.log('Notification à créer:', notificationRequest);
        this.notificationClient.createNotification(notificationRequest).subscribe((result) => console.log('Notification créée:', result), (error) => console.error('Erreur lors de la création de la notification:', error));
        return savedReservation;
    }
    async update(id, updateData) {
        await this.reservationRepository.update(id, updateData);
        const updatedReservation = await this.findOne(id);
        if (updateData.status) {
            let message = '';
            switch (updateData.status) {
                case status_enum_1.StatusEnum.APPROVED:
                    message = `Votre réservation #${id} a été approuvée`;
                    break;
                case status_enum_1.StatusEnum.CANCELLED:
                    message = `Votre réservation #${id} a été annulée`;
                    break;
                case status_enum_1.StatusEnum.PENDING:
                    message = `Votre réservation #${id} est en attente de confirmation`;
                    break;
                default:
                    message = `Le statut de votre réservation #${id} a été mis à jour`;
            }
            const notification = {
                reservationId: id,
                message,
                notificationDate: new Date().toISOString(),
                isSent: false,
            };
            this.notificationClient.createNotification(notification).subscribe((result) => console.log('Notification de mise à jour créée:', result), (error) => console.error('Erreur lors de la création de la notification de mise à jour:', error));
        }
        return updatedReservation;
    }
    async findAll() {
        return this.reservationRepository.find();
    }
    async findOne(id) {
        const reservation = await this.reservationRepository.findOne({
            where: { id: id.toString() },
        });
        if (!reservation) {
            throw new common_1.NotFoundException(`Reservation with ID ${id} not found`);
        }
        return reservation;
    }
    async remove(id) {
        await this.reservationRepository.delete(id);
    }
};
exports.ReservationService = ReservationService;
exports.ReservationService = ReservationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.ReservationEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_client_1.NotificationClient])
], ReservationService);
//# sourceMappingURL=reservation.service.js.map