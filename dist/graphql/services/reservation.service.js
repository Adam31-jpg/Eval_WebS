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
const reservation_entity_1 = require("../../entities/reservation.entity");
const rxjs_1 = require("rxjs");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ReservationService = class ReservationService {
    reservationRepository;
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    listReservations(skip, limit) {
        return (0, rxjs_1.from)(this.reservationRepository.find({ relations: [], skip, take: limit }));
    }
    reservation(id) {
        return (0, rxjs_1.from)(this.reservationRepository.findOne({ where: { id } })).pipe((0, rxjs_1.tap)((reservation) => {
            if (!reservation) {
                throw new common_1.NotFoundException();
            }
        }));
    }
    createReservation(reservationDto) {
        return (0, rxjs_1.from)(this.reservationRepository.save(this.reservationRepository.create(reservationDto)));
    }
    updateReservation(id, input) {
        return this.reservation(id).pipe((0, rxjs_1.switchMap)(() => this.reservationRepository.update(id, input)), (0, rxjs_1.switchMap)(() => this.reservationRepository.findOneOrFail({ where: { id } })));
    }
    deleteReservation(id) {
        return (0, rxjs_1.from)(this.reservationRepository.delete(id)).pipe((0, rxjs_1.map)((result) => (result.affected ? result.affected > 0 : false)));
    }
};
exports.ReservationService = ReservationService;
exports.ReservationService = ReservationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.ReservationEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReservationService);
//# sourceMappingURL=reservation.service.js.map