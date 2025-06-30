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
exports.ReservationResolver = exports.ReservationType = void 0;
const graphql_1 = require("@nestjs/graphql");
const status_enum_1 = require("../../entities/status.enum");
const room_resolver_1 = require("./room.resolver");
const user_resolver_1 = require("./user.resolver");
const rxjs_1 = require("rxjs");
const create_reservation_input_1 = require("./dto/create-reservation.input");
const reservation_service_1 = require("../services/reservation.service");
const common_1 = require("@nestjs/common");
const gq_auth_guard_1 = require("../../auth/gq-auth.guard");
let ReservationType = class ReservationType {
    id;
    start_time;
    end_time;
    status;
    location;
    created_at;
    room;
    user;
};
exports.ReservationType = ReservationType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], ReservationType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ReservationType.prototype, "start_time", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ReservationType.prototype, "end_time", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ReservationType.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ReservationType.prototype, "location", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ReservationType.prototype, "created_at", void 0);
__decorate([
    (0, graphql_1.Field)(() => room_resolver_1.RoomType, {
        nullable: true,
    }),
    __metadata("design:type", room_resolver_1.RoomType)
], ReservationType.prototype, "room", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_resolver_1.UserType, {
        nullable: true,
    }),
    __metadata("design:type", user_resolver_1.UserType)
], ReservationType.prototype, "user", void 0);
exports.ReservationType = ReservationType = __decorate([
    (0, graphql_1.ObjectType)()
], ReservationType);
let ReservationResolver = class ReservationResolver {
    reservationService;
    constructor(reservationService) {
        this.reservationService = reservationService;
    }
    listReservations(skip, limit) {
        return this.reservationService.listReservations(skip, limit);
    }
    room(id) {
        return this.reservationService.reservation(id);
    }
    createReservation(input) {
        return this.reservationService.createReservation(input);
    }
    updateRoom(id, input) {
        return this.reservationService.updateReservation(id, input);
    }
    deleteRoom(id) {
        return this.reservationService.deleteReservation(id);
    }
};
exports.ReservationResolver = ReservationResolver;
__decorate([
    (0, graphql_1.Query)(() => [ReservationType]),
    (0, common_1.UseGuards)(gq_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('skip')),
    __param(1, (0, graphql_1.Args)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", rxjs_1.Observable)
], ReservationResolver.prototype, "listReservations", null);
__decorate([
    (0, graphql_1.Query)(() => ReservationType, { nullable: true }),
    (0, common_1.UseGuards)(gq_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], ReservationResolver.prototype, "room", null);
__decorate([
    (0, graphql_1.Mutation)(() => ReservationType),
    (0, common_1.UseGuards)(gq_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reservation_input_1.CreateReservationInput]),
    __metadata("design:returntype", rxjs_1.Observable)
], ReservationResolver.prototype, "createReservation", null);
__decorate([
    (0, graphql_1.Mutation)(() => room_resolver_1.RoomType),
    (0, common_1.UseGuards)(gq_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_reservation_input_1.CreateReservationInput]),
    __metadata("design:returntype", rxjs_1.Observable)
], ReservationResolver.prototype, "updateRoom", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gq_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], ReservationResolver.prototype, "deleteRoom", null);
exports.ReservationResolver = ReservationResolver = __decorate([
    (0, graphql_1.Resolver)(() => ReservationType),
    __metadata("design:paramtypes", [reservation_service_1.ReservationService])
], ReservationResolver);
//# sourceMappingURL=reservation.resolver.js.map