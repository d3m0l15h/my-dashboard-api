import { Controller, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedGuard, DiscordAuthGuard } from 'src/utils/Guards';
import { ROUTES, SERVICES } from 'src/utils/constant';
import { AuthUser } from 'src/utils/decorator';
import { User } from 'src/utils/mongoose/schemas/user.schema';
import { AuthService } from '../services/auth.service';


@Controller(ROUTES.AUTH)
export class AuthController {
    constructor(
        @Inject(SERVICES.AUTH) private readonly authService: AuthService
    ) { }

    @Get('login')
    @UseGuards(DiscordAuthGuard)
    async login() {
    }

    @Get('redirect')
    @UseGuards(DiscordAuthGuard)
    async redirect(@Req() req: Request, @Res() res: Response) {
        // const jwt = await this.authService.login(req.user);
        // res.cookie('jwt', jwt.access_token, { httpOnly: true });
        res.redirect(`${process.env.REACT_APP_URL}/menu`);
    }

    @Get('status')
    @UseGuards(AuthenticatedGuard)
    status(@AuthUser() user: User) {
        return user;
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        // Clear the session cookie
        res.clearCookie('connect.sid');
        
        // Delete the session from MongoDB
        if (req.session) {
            req.session.destroy(err => {
                if (err) {
                    console.error('Session destruction error:', err);
                }
            });
        }

        return res.sendStatus(200); 
    }
}
