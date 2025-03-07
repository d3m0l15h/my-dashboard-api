import { Observable } from "rxjs";
import { PartialGuild, PartialGuildChannel } from "src/utils/types/type";

export interface IDiscordHttpService {
    fetchBotGuilds(): Observable<PartialGuild[]>;
    fetchUserGuilds(accessToken: string): Observable<PartialGuild[]>;
    fetchGuildChannels(guildId: string): Observable<PartialGuildChannel[]>;
}