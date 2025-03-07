import { btoa } from "buffer";

function dec2hex(dec: number): string {
    return ('0' + dec.toString(16)).slice(-2);
}

function generateCodeVerifier(): string {
    const array = new Uint32Array(56 / 2);
    crypto.getRandomValues(array);
    return Array.from(array).map(dec2hex).join('');
}

function sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(a: ArrayBuffer): string {
    var str = "";
    const bytes = new Uint8Array(a);
    const len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        str += String.fromCharCode(bytes[i]);
    }
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function generateCodeChallengeFromVerifier(v: string): Promise<string> {
    const hashed = await sha256(v);
    return base64urlencode(hashed);
}

export async function PkceChallenge(): Promise<{ code_verifier: string, code_challenge: string }> {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallengeFromVerifier(codeVerifier);
    return { code_verifier: codeVerifier, code_challenge: codeChallenge };
}