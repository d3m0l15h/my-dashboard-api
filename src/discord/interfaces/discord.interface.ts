import { Observable } from "rxjs";
import { PartialGuild, PartialGuildChannel } from "src/utils/types/type";

export interface IDiscordService {
    getBotGuilds(): Observable<PartialGuild[]>;
    getUserGuilds(accessToken: string, userId: string): Observable<PartialGuild[]>;
    getMutualGuilds(accessToken: string, userId: string): Observable<PartialGuild[]> ;
    getGuildChannels(guildId: string): Observable<PartialGuildChannel[]>;
}