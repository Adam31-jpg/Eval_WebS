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
exports.RoomResolver = exports.RoomType = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const reservation_resolver_1 = require("./reservation.resolver");
const rxjs_1 = require("rxjs");
const create_room_input_1 = require("./dto/create-room.input");
const room_service_1 = require("../services/room.service");
const common_1 = require("@nestjs/common");
const gq_auth_guard_1 = require("../../auth/gq-auth.guard");
let RoomType = class RoomType {
    id;
    name;
    capacity;
    location;
    created_at;
    reservations;
};
exports.RoomType = RoomType;
__decorate([
    (0, graphql_2.Field)(() => graphql_2.ID),
    __metadata("design:type", String)
], RoomType.prototype, "id", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", String)
], RoomType.prototype, "name", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", String)
], RoomType.prototype, "capacity", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", String)
], RoomType.prototype, "location", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", String)
], RoomType.prototype, "created_at", void 0);
__decorate([
    (0, graphql_2.Field)(() => [reservation_resolver_1.ReservationType], {
        nullable: true,
    }),
    __metadata("design:type", Array)
], RoomType.prototype, "reservations", void 0);
exports.RoomType = RoomType = __decorate([
    (0, graphql_2.ObjectType)()
], RoomType);
let RoomResolver = class RoomResolver {
    roomService;
    constructor(roomService) {
        this.roomService = roomService;
    }
    listRooms(skip, limit) {
        return this.roomService.listRooms(skip, limit);
    }
    room(id) {
        return this.roomService.room(id);
    }
    createRoom(input) {
        return this.roomService.createRoom(input);
    }
    updateRoom(id, input) {
        return this.roomService.updateRoom(id, input);
    }
    deleteRoom(id) {
        return this.roomService.deleteRoom(id);
    }
};
exports.RoomResolver = RoomResolver;
__decorate([
    (0, graphql_1.Query)(() => [RoomType]),
    (0, common_1.UseGuards)(gq_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('skip')),
    __param(1, (0, graphql_1.Args)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", rxjs_1.Observable)
], RoomResolver.prototype, "listRooms", null);
__decorate([
    (0, graphql_1.Query)(() => RoomType, { nullable: true }),
    (0, common_1.UseGuards)(gq_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], RoomResolver.prototype, "room", null);
__decorate([
    (0, graphql_1.Mutation)(() => RoomType),
    (0, common_1.UseGuards)(gq_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_room_input_1.CreateRoomInput]),
    __metadata("design:returntype", rxjs_1.Observable)
], RoomResolver.prototype, "createRoom", null);
__decorate([
    (0, graphql_1.Mutation)(() => RoomType),
    (0, common_1.UseGuards)(gq_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_room_input_1.CreateRoomInput]),
    __metadata("design:returntype", rxjs_1.Observable)
], RoomResolver.prototype, "updateRoom", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gq_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], RoomResolver.prototype, "deleteRoom", null);
exports.RoomResolver = RoomResolver = __decorate([
    (0, graphql_1.Resolver)(() => RoomType),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], RoomResolver);
//# sourceMappingURL=room.resolver.js.map