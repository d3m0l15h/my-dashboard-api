import { Module } from "@nestjs/common";
import { FEATURE } from "src/utils/constant";
import { MongooseModule } from "@nestjs/mongoose";

import { WelcomeFeatureController } from "./controllers/features";
import { WelcomeFeatureService } from "./services/features";
import { WelcomeFeature, WelcomeFeatureSchema } from "src/utils/mongoose/schemas/features";
import { CloudinaryService } from "./services/cdn.service";
import { DiscordModule } from "src/discord/discord.module";


@Module({
    controllers: [WelcomeFeatureController],
    imports: [
        DiscordModule,
        MongooseModule.forFeature([
        { name: WelcomeFeature.name, schema: WelcomeFeatureSchema },

    ])],
    providers: [
        {
            provide: FEATURE.WELCOME,
            useClass: WelcomeFeatureService
        },
        CloudinaryService
    ]
})
export class GuildsModule { }