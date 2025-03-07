import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { DiscordModule } from './discord/discord.module';
import { GuildsModule } from './guilds/guilds.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    PassportModule.register({ session: true }),
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION!),
    AuthModule,
    UserModule,
    DiscordModule,
    GuildsModule,
    RedisModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
