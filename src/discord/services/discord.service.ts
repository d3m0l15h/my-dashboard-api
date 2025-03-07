import { Inject, Injectable } from "@nestjs/common";
import { IDiscordService } from "../interfaces/discord.interface";
import { Observable, concatMap, map } from "rxjs";
import { PartialGuild, PartialGuildChannel } from "src/utils/types/type";
import { IDiscordHttpService } from "../interfaces/discord_http.interface";
import { SERVICES } from "../../utils/constant";

@Injectable()
export class DiscordService implements IDiscordService {
    constructor(
        @Inject(SERVICES.DISCORD_HTTP) private readonly discordHttpService: IDiscordHttpService
    ) { }

    getBotGuilds(): Observable<PartialGuild[]> {
        return this.discordHttpService.fetchBotGuilds();
    }

    getUserGuilds(accessToken: string): Observable<PartialGuild[]> {
        return this.discordHttpService.fetchUserGuilds(accessToken);
    }

    getMutualGuilds(accessToken: string): Observable<PartialGuild[]> {
        return this.getUserGuilds(accessToken).pipe(
            map(guilds => this.filterAdminGuilds(guilds)),
            concatMap(userGuilds =>
                this.getBotGuilds().pipe(
                    map(botGuilds => {
                        return userGuilds.map(guild => {
                            return {
                                ...guild,
                                hadBot: botGuilds.some(botGuild => botGuild.id === guild.id)
                            };
                        }
                        )
                    })
                )
            )
        );
    }

    getGuildChannels(guildId: string): Observable<PartialGuildChannel[]> {
        return this.discordHttpService.fetchGuildChannels(guildId);
    }

    private filterAdminGuilds(guilds: PartialGuild[]): PartialGuild[] {
        return guilds.filter(guild => {
            const permissions = BigInt(guild.permissions);
            const ADMINISTRATOR = BigInt(0x8);
            return (permissions & ADMINISTRATOR) === ADMINISTRATOR;
        });
    }
}