import { User } from "src/utils/mongoose/schemas/user.schema";
import { UserDetails } from "src/utils/types/type";

export interface IAuthService{
    validateUser(detail: UserDetails):Promise<User>;
}