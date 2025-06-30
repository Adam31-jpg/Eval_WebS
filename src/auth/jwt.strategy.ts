/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const isTestMode = process.env.NODE_ENV === 'test';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: isTestMode
        ? (request: any, rawJwtToken: any, done: any) => {
          // En mode test, on accepte les tokens mock
          if (rawJwtToken.startsWith('mock-')) {
            done(null, 'mock-secret');
          } else {
            // Pour les vrais tokens JWT en test
            const client = jwksRsa.passportJwtSecret({
              cache: true,
              rateLimit: true,
              jwksRequestsPerMinute: 5,
              jwksUri: 'http://localhost:8080/realms/myrealm/protocol/openid-connect/certs',
            });
            client(request, rawJwtToken, done);
          }
        }
        : jwksRsa.passportJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'http://localhost:8080/realms/myrealm/protocol/openid-connect/certs',
        }),
      issuer: isTestMode ? undefined : 'http://localhost:8080/realms/myrealm',
      algorithms: ['RS256'],
      passReqToCallback: true,
      ignoreExpiration: isTestMode,
    });
  }

  async validate(request: any, payload: any) {
    console.log('🔍 JWT Strategy validate appelée');

    const authHeader = request.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    console.log('Token reçu:', token?.substring(0, 20) + '...');

    // Gestion des tokens mock en mode test
    if (token?.startsWith('mock-') && process.env.NODE_ENV === 'test') {
      console.log('🧪 Mode Test: Validation token mock');

      let mockRoles = ['user'];
      let email = 'mockuser@example.com';

      if (token.includes('admin')) {
        mockRoles = ['admin'];
        email = 'mockadmin@example.com';
      }

      const mockUser = {
        userId: 'mock-user-id',
        username: 'mock-user',
        email: email,
        roles: mockRoles,
        realm_access: { roles: mockRoles }
      };

      console.log('Mock user créé:', mockUser);
      return mockUser;
    }

    // Validation normale pour les vrais tokens JWT
    if (!payload) {
      console.log('❌ Payload JWT manquant');
      throw new UnauthorizedException('Token invalide');
    }

    console.log('✅ Payload JWT reçu:', payload);

    const roles = payload.realm_access?.roles || [];

    const user = {
      userId: payload.sub,
      username: payload.username || payload.preferred_username,
      email: payload.email,
      roles: roles,
      realm_access: payload.realm_access
    };

    console.log('User validé:', user);
    return user;
  }
}