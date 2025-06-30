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
exports.AuthService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const user_entity_1 = require("../entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AuthService = class AuthService {
    userRepository;
    httpService;
    constructor(userRepository, httpService) {
        this.userRepository = userRepository;
        this.httpService = httpService;
    }
    login(email, password) {
        return this.getKeycloakToken(email, password).pipe((0, rxjs_1.switchMap)((responseToken) => this.getKeycloakUserInfo(responseToken.data.access_token).pipe((0, rxjs_1.switchMap)((responseUserInfo) => (0, rxjs_1.forkJoin)([
            this.getByEmail(responseUserInfo.data.email),
            (0, rxjs_1.of)(responseUserInfo.data),
        ])), (0, rxjs_1.switchMap)(([user, userInfo]) => {
            if (!user) {
                return this.createUser({
                    email: userInfo.email,
                    keycloakId: userInfo.sub,
                    createdAt: new Date()
                });
            }
            return (0, rxjs_1.of)(user);
        }), (0, rxjs_1.map)(() => {
            console.log(responseToken.data.access_token);
            return { accessToken: responseToken.data.access_token };
        }))));
    }
    createUser(user) {
        console.log('gggggg');
        return (0, rxjs_1.defer)(() => this.userRepository.save(user));
    }
    getByEmail(email) {
        console.log('iiii');
        return (0, rxjs_1.from)(this.userRepository.findOneOrFail({
            where: { email },
        }));
    }
    getKeycloakUserInfo(accessToken) {
        console.log('uuuu');
        return this.httpService.get('http://localhost:8080/realms/myrealm/protocol/openid-connect/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    }
    getKeycloakToken(username, password) {
        console.log('ffff');
        return this.httpService.post('http://localhost:8080/realms/myrealm/protocol/openid-connect/token', {
            grant_type: 'password',
            client_id: 'myclient',
            client_secret: 'mysecret',
            scope: 'openid profile',
            username,
            password,
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map