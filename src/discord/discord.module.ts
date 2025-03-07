import { Module } from '@nestjs/common';
import { DiscordController } from './controllers/discord.controller';
import { DiscordService } from './services/discord.service';
import { HttpModule } from '@nestjs/axios';
import { SERVICES } from 'src/utils/constant';
import { DiscordHttpService } from './services/discord_http.service';
import { EventsGateway } from 'src/utils/gateways/EventsGateway';
import { AuthModule } from 'src/auth/auth.module';
import { RedisService } from 'src/redis/services/redis.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
    imports: [
        HttpModule,
        AuthModule,
        RedisModule
    ],
    controllers: [DiscordController],
    providers: [
        {
            provide: SERVICES.DISCORD,
            useClass: DiscordService
        },
        {
            provide: SERVICES.DISCORD_HTTP,
            useClass: DiscordHttpService
        },
        {
            provide: 'REDIS',
            useClass: RedisService
        },
        EventsGateway
    ],
    exports: [{
        provide: SERVICES.DISCORD,
        useClass: DiscordService
    }]
})
export class DiscordModule { }
