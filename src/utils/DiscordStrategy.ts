import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { SERVICES } from "./constant";
import { IAuthService } from "src/auth/interfaces/auth.interface";
import { Profile, Strategy } from "passport-discord";

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(@Inject(SERVICES.AUTH) private readonly authService: IAuthService) {
    super({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_REDIRECT_URL,
      scope: ['identify', 'email', 'guilds'],
      pkce: true,
      state: true
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return await this.authService.validateUser({
      discordId: profile.id,
      username: profile.username,
      avatar: profile.avatar,
      global_name: profile.global_name,
      accessToken: accessToken,
      refreshToken: refreshToken
    });
  }
}