import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from 'src/user/user.module';
import { SERVICES } from 'src/utils/constant';
import { JwtStrategy } from 'src/utils/JwtStrategy';
import { SessionSerializer } from 'src/utils/SessionSerializer';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DiscordStrategy } from 'src/utils/DiscordStrategy';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'discord', session: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    })
  ],
  controllers: [AuthController],
  providers: [
    DiscordStrategy,
    JwtStrategy,
    SessionSerializer,
    {
      provide: SERVICES.AUTH,
      useClass: AuthService
    },
  ]
})
export class AuthModule { }
