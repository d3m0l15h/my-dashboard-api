import { Body, Controller, Get, Inject, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { IFeatureService } from "src/guilds/interfaces/feature.interface";
import { CloudinaryService } from "src/guilds/services";
import { AuthenticatedGuard, GuildPermissionGuard } from "src/utils/Guards";
import { FEATURE, ROUTES} from "src/utils/constant";
import { WelcomeFeature } from "src/utils/mongoose/schemas";


@Controller(`${ROUTES.FEATURE}/welcome`)
@UseGuards(AuthenticatedGuard)
export class WelcomeFeatureController {
    constructor(
        @Inject(FEATURE.WELCOME) private readonly welcomeFeatureService: IFeatureService<WelcomeFeature>,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @Post('upload-background')
    @UseInterceptors(FileInterceptor('file'))
    async uploadBackground(@UploadedFile() file: Express.Multer.File, @Body() body: { guildId: string }) {
        const res = await this.welcomeFeatureService.get(body.guildId);
        if (res) {
            const { secure_url } = await this.cloudinaryService.uploadImage(file, `welcome_${body.guildId}`, 1200, 675);
            return { secure_url };
        } else {
            return { message: 'Guild not found' }
        }
    }

    @Get(':guildId')
    async getWelcomeFeature(@Param('guildId') guildId: string) {
        return this.welcomeFeatureService.get(guildId);
    }

    @Post(':guildId')
    @UseGuards(GuildPermissionGuard)
    async upsertWelcomeFeature(@Param('guildId') guildId: string, @Body() updateDto: Partial<WelcomeFeature>) {       
        return this.welcomeFeatureService.upsert(guildId, updateDto);
    }
}