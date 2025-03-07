import { Module } from "@nestjs/common";
import { RedisService } from "./services/redis.service";

@Module({
    providers: [
        {
            provide: 'REDIS',
            useClass: RedisService
        }
    ],
    exports: [
        {
            provide: 'REDIS',
            useClass: RedisService
        }
    ]
})
export class RedisModule {}