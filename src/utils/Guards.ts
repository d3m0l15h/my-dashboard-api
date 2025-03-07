import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { DiscordService } from "src/discord/services/discord.service";
import { User } from "./mongoose/schemas";
import { firstValueFrom, map } from "rxjs";
import { SERVICES } from "./constant";

@Injectable()
export class DiscordAuthGuard extends AuthGuard('discord') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const activate = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return activate;
    }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        return request.isAuthenticated();
    }
}
 
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        return super.canActivate(context) as boolean;
    }
    // handleRequest(err: any, user: any, info: any) {
    //     if (err || !user) {
    //         throw err || new Error(info.message);
    //     }
    //     return user;
    // }
}

@Injectable()
export class GuildPermissionGuard implements CanActivate {
    constructor(@Inject(SERVICES.DISCORD) private readonly discordService: DiscordService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user as User;
        const guildId = request.params.guildId;
        const permission = this.discordService.getMutualGuilds(user!.accessToken).pipe(
            map(guilds => guilds.some(guild => guild.id === guildId))
        )
        if(!await firstValueFrom(permission)) throw new UnauthorizedException('You do not have permission to update this guild');

        return true;
    }
}