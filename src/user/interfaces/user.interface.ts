import { User } from "src/utils/mongoose/schemas/user.schema";
import { UserDetails } from "src/utils/types/type";

export interface IUserService {
    upsert(details: UserDetails): Promise<User>
    get(discordId: string): Promise<User | null | undefined>
    refreshAccessToken(details: UserDetails): Promise<User | null>;
}