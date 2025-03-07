import { PassportSerializer } from "@nestjs/passport";
import { User } from "./mongoose/schemas/user.schema";
import { Done } from "./types/type";
import { Inject } from "@nestjs/common";
import { SERVICES } from "./constant";
import { IUserService } from "src/user/interfaces/user.interface";

export class SessionSerializer extends PassportSerializer {
    constructor(@Inject(SERVICES.USER) private readonly userService: IUserService) {
        super();
    }

    serializeUser(user: User, done: Done) {
        done(null, user);
    }

    async deserializeUser(user: User, done: Done) {
        try {
            const userDB = await this.userService.get(user.discordId);
            return userDB ? done(null, userDB) : done(null, null);
        }
        catch (err) {
            done(err, null);
        }
    }
}