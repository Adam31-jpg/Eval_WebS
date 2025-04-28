/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri:
          'http://localhost:8080/realms/myrealm/protocol/openid-connect/certs',
      }),
      // audience: 'myclient',
      issuer: 'http://localhost:8080/realms/myrealm',
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  validate(payload: any) {
    console.log('Payload reçu dans validate :', payload);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return { userId: payload.sub, username: payload.username };
  }
}
