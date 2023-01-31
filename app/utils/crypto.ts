import crypto from 'crypto';
import environment from '../config/environment';
import { Data } from '../types/electron.types';

// Getting algorithm
const algorithm = environment.algorithm;

// Defining key
const password = environment.key;
const key = crypto.scryptSync(password || '123456', 'salt', 32);

export function decrypt(data: Data) {
    if (!algorithm) return;

    const iv = Buffer.from(data.iv, 'hex');
    const encryptedText = Buffer.from(data.encryptedData, 'hex');

    // Creating Decipher
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);

    // Updating encrypted text
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    // returns data after decryption
    return decrypted.toString();
}
