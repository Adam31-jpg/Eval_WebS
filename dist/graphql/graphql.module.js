"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLAppModule = void 0;
const common_1 = require("@nestjs/common");
const reservation_service_1 = require("./services/reservation.service");
const user_service_1 = require("./services/user.service");
const room_service_1 = require("./services/room.service");
const reservation_resolver_1 = require("./resolvers/reservation.resolver");
const user_resolver_1 = require("./resolvers/user.resolver");
const room_resolver_1 = require("./resolvers/room.resolver");
const axios_1 = require("@nestjs/axios");
const notification_entity_1 = require("../entities/notification.entity");
const typeorm_1 = require("@nestjs/typeorm");
const reservation_entity_1 = require("../entities/reservation.entity");
const room_entity_1 = require("../entities/room.entity");
const user_entity_1 = require("../entities/user.entity");
const auth_module_1 = require("../auth/auth.module");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const path_1 = require("path");
let GraphQLAppModule = class GraphQLAppModule {
};
exports.GraphQLAppModule = GraphQLAppModule;
exports.GraphQLAppModule = GraphQLAppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([
                notification_entity_1.NotificationEntity,
                reservation_entity_1.ReservationEntity,
                user_entity_1.UserEntity,
                room_entity_1.RoomEntity,
            ]),
            graphql_1.GraphQLModule.forRoot({
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                driver: apollo_1.ApolloDriver,
            }),
        ],
        controllers: [],
        providers: [
            reservation_service_1.ReservationService,
            user_service_1.UserService,
            room_service_1.RoomService,
            reservation_resolver_1.ReservationResolver,
            user_resolver_1.UserResolver,
            room_resolver_1.RoomResolver,
        ],
        exports: [user_service_1.UserService],
    })
], GraphQLAppModule);
//# sourceMappingURL=graphql.module.js.map