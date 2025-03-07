export interface IFeatureService<T> {
    get(guildId: string): Promise<T | null>;
    upsert(guildId: string, updateDto: Partial<T>): Promise<T | null>;
    // delete(guildId: string): Promise<unknown>;
}