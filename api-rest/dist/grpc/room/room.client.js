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
exports.RoomClient = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
let RoomClient = class RoomClient {
    roomService;
    client;
    onModuleInit() {
        this.roomService = this.client.getService('RoomService');
    }
    createRoom(room) {
        return this.roomService.Create(room);
    }
    findAllRooms() {
        return this.roomService.FindAll({});
    }
    findOneRoom(id) {
        return this.roomService.FindOne({ id });
    }
    updateRoom(id, room) {
        return this.roomService.Update({ id, room });
    }
    removeRoom(id) {
        return this.roomService.Remove({ id });
    }
};
exports.RoomClient = RoomClient;
__decorate([
    (0, microservices_1.Client)({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'room',
            protoPath: (0, path_1.join)(__dirname, './room.proto'),
            url: 'localhost:50053',
        },
    }),
    __metadata("design:type", Object)
], RoomClient.prototype, "client", void 0);
exports.RoomClient = RoomClient = __decorate([
    (0, common_1.Injectable)()
], RoomClient);
//# sourceMappingURL=room.client.js.map