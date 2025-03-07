import * as crypto from 'crypto';

export function encrypt(text: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(process.env.JWT_SECRET!), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(text: string) {
    const [ivText, encryptedText] = text.split(':');
    const iv = Buffer.from(ivText, 'hex');
    const encrypted = Buffer.from(encryptedText, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(process.env.JWT_SECRET!), iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString();
}

export function binarySearchGuilds(guilds: { id: number }[], guildId: number): boolean {
    let start = 0;
    let end = guilds.length - 1;

    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        if (guilds[mid].id === guildId) {
            return true;
        } else if (guilds[mid].id < guildId) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }
    return false;
}