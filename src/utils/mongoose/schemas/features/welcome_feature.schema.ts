import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
class WelcomeMessage {
    @Prop({ default: false })
    enabled: boolean;

    @Prop({ default: "" })
    channelId: string;

    @Prop({ default: "" })
    backgroundUrl: string;
}

@Schema()
class LeavingMessage {
    @Prop({ default: false })
    enabled: boolean;

    @Prop({ default: "" })
    channelId: string;

    @Prop({ default: "" })
    message: string;
}

@Schema()
export class WelcomeFeature extends Document {
    @Prop({ required: true })
    guildId: string;

    @Prop({ default: false })
    enabled: boolean;

    @Prop({ type: WelcomeMessage, default: () => ({}) })
    welcome: WelcomeMessage;

    @Prop({ type: LeavingMessage, default: () => ({}) })
    leaving: {
        enabled: boolean, channelId: string,
        message: string
    }
}

export const WelcomeFeatureSchema = SchemaFactory.createForClass(WelcomeFeature);