import { Inject, Injectable } from '@nestjs/common';
import { IUserService } from 'src/user/interfaces/user.interface';
import { SERVICES } from 'src/utils/constant';
import { UserDetails } from 'src/utils/types/type';
import { IAuthService } from '../interfaces/auth.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @Inject(SERVICES.USER) private readonly userService: IUserService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(details: UserDetails) {
        return await this.userService.upsert(details);
    }

    async login(user: any) {
        const payload = { username: user.username, id: user.discordId };
        return {
            access_token: this.jwtService.sign(payload,{secret: process.env.JWT_SECRET, expiresIn: '1d'}),
        };
    }
}
