"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const jwksRsa = require("jwks-rsa");
class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKeyProvider: jwksRsa.passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: 'http://localhost:8080/realms/myrealm/protocol/openid-connect/certs',
            }),
            issuer: 'http://localhost:8080/realms/myrealm',
            algorithms: ['RS256'],
            passReqToCallback: true,
        });
    }
    validate(payload) {
        console.log('Payload reçu dans validate :', payload);
        return { userId: payload.sub, username: payload.username };
    }
}
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt.strategy.js.map