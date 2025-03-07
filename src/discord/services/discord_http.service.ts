import { Inject, Injectable, Logger } from "@nestjs/common";
import { IDiscordHttpService } from "../interfaces/discord_http.interface";
import { HttpService } from "@nestjs/axios";
import { catchError, delay, map, mergeMap, Observable, of, retry, throwError} from "rxjs";
import { PartialGuild, PartialGuildChannel } from "../../utils/types/type";
import { RedisService } from "src/redis/services/redis.service";

@Injectable()
export class DiscordHttpService implements IDiscordHttpService {
    private readonly logger = new Logger(DiscordHttpService.name);
    private readonly DISCORD_API_URL = 'https://discord.com/api/v10';
    constructor(
        private readonly httpService: HttpService,
        @Inject('REDIS') private readonly redisService: RedisService
    ) { }

    private async getBucketKey(route: string): Promise<string> {
        return await this.redisService.get(`route_bucket:${route}`) || 'global';
    }

    private async checkRateLimits(route: string): Promise<void> {        
        // Check global rate limit (50 requests/second)
        const globalKey = `global:${Math.floor(Date.now() / 1000)}`;
        const globalCount = await this.redisService.incr(globalKey);
        if (globalCount === 1) await this.redisService.expire(globalKey, 2);
        if (globalCount > 50) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Check bucket-specific limit
        const bucketKey = await this.getBucketKey(route);
        if (bucketKey !== 'global') {
            const bucketData = await this.redisService.hgetall(`bucket:${bucketKey}`);
            if (bucketData.remaining === '0') {
                const resetTime = parseInt(bucketData.reset, 10) * 1000;
                const delayTime = Math.max(resetTime - Date.now(), 0);
                await new Promise(resolve => setTimeout(resolve, delayTime));
            }
        }
    }

    private async updateRateLimits(route: string, headers: any): Promise<void> {
        const bucket = headers['x-ratelimit-bucket'];
        
        if (bucket) {
            // Store bucket information
            await this.redisService.set(`route_bucket:${route}`, bucket);
            await this.redisService.hset(`bucket:${bucket}`, {
                limit: headers['x-ratelimit-limit'],
                remaining: headers['x-ratelimit-remaining'],
                reset: headers['x-ratelimit-reset'],
                resetAfter: headers['x-ratelimit-reset-after']
            });
            await this.redisService.expire(`bucket:${bucket}`, Math.ceil(headers['x-ratelimit-reset-after']) || 1);
        }
    }

    private handleRateLimitError(error: any, route: string): Observable<any> {
        if (error.response?.status !== 429) return throwError(() => error);

        const retryAfter = (error.response.data?.retry_after || 
                          error.response.headers['retry-after'] ||
                          error.response.headers['x-ratelimit-reset-after'] || 1) * 1000;

        this.logger.warn(`Rate limited on ${route}. Retrying after ${retryAfter}ms`);

        if (error.response.data?.global) {
            this.logger.error('Global rate limit hit!');
            return of(error).pipe(delay(retryAfter));
        }

        return of(error).pipe(
            delay(retryAfter),
            mergeMap(() => this.makeRequest(route, error.config.headers))
        );
    }

    private makeRequest<T>(route: string, headers: any): Observable<T> {
        return new Observable<T>(subscriber => {
            this.checkRateLimits(route)
                .then(() => {
                    this.httpService.get<T>(route, { headers })
                        .pipe(
                            map(response => {
                                this.updateRateLimits(route, response.headers);
                                return response.data;
                            }),
                            catchError(error => this.handleRateLimitError(error, route))
                        )
                        .subscribe(subscriber);
                })
                .catch(error => subscriber.error(error));
        });
    }

    fetchBotGuilds(): Observable<PartialGuild[]> {
        const route = `${this.DISCORD_API_URL}/users/@me/guilds`;
        const headers = {
            Authorization: `Bot ${process.env.BOT_TOKEN}`
        };

        return this.makeRequest<PartialGuild[]>(route, headers);
    }

    fetchUserGuilds(accessToken: string): Observable<PartialGuild[]> {
        const route = `${this.DISCORD_API_URL}/users/@me/guilds`;
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }

        return this.makeRequest<PartialGuild[]>(route, headers );
    }

    fetchGuildChannels(guildId: string): Observable<PartialGuildChannel[]> {
        const route = `${this.DISCORD_API_URL}/guilds/${guildId}/channels`;
        const headers = {
            Authorization: `Bot ${process.env.BOT_TOKEN}`
        }

        return this.makeRequest<PartialGuildChannel[]>(route, headers);
    }
} 