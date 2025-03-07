import { User } from "../mongoose/schemas/user.schema";

export type UserDetails = {
    discordId: string;
    username: string;
    avatar: string|null;
    global_name: string | null;
    accessToken: string;
    refreshToken: string;
};

export type Done = (
    err: Error | null,
    user: User | null
) => void;

export type PartialGuild = {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
    features: string[];
    hadBot?: boolean;
}

export type PartialGuildChannel = {
    id: string;
    type: number;
    name: string;
    flags: number;
    guild_id: string;
    rate_limit_per_user: number;
    position: number;
    topic?: string;
    parent_id?: string;
    permission_overwrites: string[];
    nsfw: boolean;
    banner?: string;
}