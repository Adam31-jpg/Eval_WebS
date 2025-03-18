/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'n102fSCluB9KyVf,BLXdS!rPb',
    });
  }

  validate(paylod: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return { userId: paylod.sub, username: paylod.username };
  }
}
