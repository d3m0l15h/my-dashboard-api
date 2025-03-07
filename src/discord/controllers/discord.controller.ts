import { Body, Controller, Get, Inject, Param, Post, Res, UseGuards } from "@nestjs/common";
import { ROUTES, SERVICES } from "../../utils/constant";
import { IDiscordService } from "../interfaces/discord.interface";
import { AuthUser } from "src/utils/decorator";
import { User } from "src/utils/mongoose/schemas/user.schema";
import { Response } from "express";
import { map } from "rxjs";
import { AuthenticatedGuard, JwtAuthGuard } from "src/utils/Guards";
import { EventsGateway } from "src/utils/gateways/EventsGateway";
import { RedisService } from "src/redis/services/redis.service";

@Controller(ROUTES.DISCORD)
export class DiscordController {
    constructor(
        @Inject(SERVICES.DISCORD) private discordService: IDiscordService,
        private readonly eventsGateway: EventsGateway,
        @Inject('REDIS') private readonly redisService: RedisService,
    ) { }

    @Get('guilds')
    @UseGuards(AuthenticatedGuard)
    getMutualGuilds(@AuthUser() user: User, @Res() res: Response): void {
        this.discordService.getMutualGuilds(user.accessToken, user.discordId).subscribe({
            next: (data) => res.json(data),
            error: (err) => {
                if (err.status === 429) {
                    res.status(429).json({ message: err.message });
                } else {
                    res.status(err.status || 500).json({ message: err.message || 'An error occurred' });
                }
            }
        });
    }

    @Get('guilds/:guildId/channels/texts')
    @UseGuards(AuthenticatedGuard)
    getGuildTextChannels(@Param('guildId') guildId: string) {
        return this.discordService.getGuildChannels(guildId).pipe(
            map(channels => channels.filter(channel => channel.type === 0))
        );
    }

    @Post('guild-delete')
    @UseGuards(JwtAuthGuard)
    deleteGuild(@Body() body: { guildId: string }) {
        this.eventsGateway.notifyGuildDelete(body.guildId);
        return { message: 'Guild deleted' };
    }

    @Get('test-cache')
    testCache() {
        this.redisService.set('test', 'test', 100);
        return this.redisService.get('test');
    }
}