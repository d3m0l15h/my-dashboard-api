import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IFeatureService } from "../../interfaces/feature.interface";
import { WelcomeFeature } from "src/utils/mongoose/schemas/features";

@Injectable()
export class WelcomeFeatureService implements IFeatureService<WelcomeFeature> {
    constructor(
        @InjectModel(WelcomeFeature.name) private readonly welcomeFeatureModel: Model<WelcomeFeature>
    ) { }

    async get(guildId: string): Promise<WelcomeFeature | null> {
        return await this.welcomeFeatureModel.findOne({ guildId }).exec();
    }

    async upsert(guildId: string, updateDto: Partial<WelcomeFeature>): Promise<WelcomeFeature | null> {
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    
        // Simplify the conditional logic for updateDto.leaving
        if (updateDto.leaving && (!updateDto.leaving.channelId || !updateDto.leaving.message)) {
            updateDto.leaving.enabled = false;
        }
    
        // Directly return the promise
        return this.welcomeFeatureModel.findOneAndUpdate({ guildId }, updateDto, options).exec();
    }
}