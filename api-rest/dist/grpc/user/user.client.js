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
exports.UserClient = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
let UserClient = class UserClient {
    userService;
    client;
    onModuleInit() {
        this.userService = this.client.getService('UserService');
    }
    createUser(user) {
        return this.userService.Create(user);
    }
    findAllUsers() {
        return this.userService.FindAll({});
    }
    findOneUser(id) {
        return this.userService.FindOne({ id });
    }
    updateUser(id, user) {
        return this.userService.Update({ id, user });
    }
    removeUser(id) {
        return this.userService.Remove({ id });
    }
};
exports.UserClient = UserClient;
__decorate([
    (0, microservices_1.Client)({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'user',
            protoPath: (0, path_1.join)(__dirname, './user.proto'),
            url: 'localhost:50054',
        },
    }),
    __metadata("design:type", Object)
], UserClient.prototype, "client", void 0);
exports.UserClient = UserClient = __decorate([
    (0, common_1.Injectable)()
], UserClient);
//# sourceMappingURL=user.client.js.map