import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { GqlAuthGuard } from './gq-auth.guard';
import { HttpModule } from '@nestjs/axios';
import { GraphQLAppModule } from '../graphql/graphql.module';

@Module({
  imports: [
    forwardRef(() => GraphQLAppModule),
    HttpModule,
    PassportModule,
    JwtModule.register({
      secret: 'n102fSCluB9KyVf,BLXdS!rPb',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy, GqlAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
