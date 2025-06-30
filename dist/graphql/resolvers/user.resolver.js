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
exports.UserResolver = exports.UserType = exports.accessTokenType = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const reservation_resolver_1 = require("./reservation.resolver");
const user_service_1 = require("../services/user.service");
const rxjs_1 = require("rxjs");
const common_1 = require("@nestjs/common");
const gq_auth_guard_1 = require("../../auth/gq-auth.guard");
let accessTokenType = class accessTokenType {
    accessToken;
};
exports.accessTokenType = accessTokenType;
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", String)
], accessTokenType.prototype, "accessToken", void 0);
exports.accessTokenType = accessTokenType = __decorate([
    (0, graphql_2.ObjectType)()
], accessTokenType);
let UserType = class UserType {
    id;
    keycloak_id;
    email;
    created_at;
    reservations;
};
exports.UserType = UserType;
__decorate([
    (0, graphql_2.Field)(() => graphql_2.ID),
    __metadata("design:type", String)
], UserType.prototype, "id", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", String)
], UserType.prototype, "keycloak_id", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", String)
], UserType.prototype, "email", void 0);
__decorate([
    (0, graphql_2.Field)(),
    __metadata("design:type", String)
], UserType.prototype, "created_at", void 0);
__decorate([
    (0, graphql_2.Field)(() => [reservation_resolver_1.ReservationType], {
        nullable: true,
    }),
    __metadata("design:type", reservation_resolver_1.ReservationType)
], UserType.prototype, "reservations", void 0);
exports.UserType = UserType = __decorate([
    (0, graphql_2.ObjectType)()
], UserType);
let UserResolver = class UserResolver {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    listUsers(skip, limit) {
        return this.userService.listUsers(skip, limit);
    }
    room(id) {
        return this.userService.user(id);
    }
    login(email, password) {
        return this.userService.login(email, password);
    }
};
exports.UserResolver = UserResolver;
__decorate([
    (0, graphql_1.Query)(() => [UserType]),
    (0, common_1.UseGuards)(gq_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('skip')),
    __param(1, (0, graphql_1.Args)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserResolver.prototype, "listUsers", null);
__decorate([
    (0, graphql_1.Query)(() => UserType, { nullable: true }),
    (0, common_1.UseGuards)(gq_auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserResolver.prototype, "room", null);
__decorate([
    (0, graphql_1.Query)(() => accessTokenType),
    __param(0, (0, graphql_1.Args)('email')),
    __param(1, (0, graphql_1.Args)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserResolver.prototype, "login", null);
exports.UserResolver = UserResolver = __decorate([
    (0, graphql_1.Resolver)(() => UserType),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserResolver);
//# sourceMappingURL=user.resolver.js.map