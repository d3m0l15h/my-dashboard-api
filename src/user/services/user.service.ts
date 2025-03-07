import { Injectable } from "@nestjs/common";
import { User } from "src/utils/mongoose/schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDetails } from "src/utils/types/type";
import { IUserService } from "../interfaces/user.interface";
import { decrypt, encrypt } from "src/utils/util";

@Injectable()
export class UserService implements IUserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

    async upsert(details: UserDetails): Promise<User> {
        const { discordId, accessToken, refreshToken, ...updatedDetail } = details;

        const encryptedAccessToken = encrypt(accessToken);
        const encryptedRefreshToken = encrypt(refreshToken);

        // Ensure the schema is defined to accept additional properties or use Mixed type for dynamic fields.
        const updateData = {
            $set: {
                accessToken: encryptedAccessToken,
                refreshToken: encryptedRefreshToken,
                ...updatedDetail,
                updatedAt: new Date()
            }
        };

        const user = await this.userModel.findOneAndUpdate(
            { discordId },
            updateData,
            { new: true, upsert: true, useFindAndModify: false } // useFindAndModify: false for deprecation warning
        );

        return user;
    }

    async get(discordId: string): Promise<User | null | undefined> {
        const user = await this.userModel.findOne({ discordId }).exec();
        if (user) {
            user.accessToken = decrypt(user.accessToken);
            user.refreshToken = decrypt(user.refreshToken);
        }
        return user;
    }

    async refreshAccessToken(details: UserDetails): Promise<User | null> {
        const user = await this.userModel.findOneAndUpdate(
            { discordId: details.discordId },
            { accessToken: details.accessToken, refreshToken: details.refreshToken },
            { new: true }
        );
        return user;
    }
}