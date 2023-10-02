const crypto = require('crypto');
const key = process.env.ENCRYPTION_KEY || '12345678';
const algorithm = 'aes-256-cbc';
class EncryptDecrypt {
    static Encrypt(str) {
        const k = crypto.createCipher(algorithm, key);
        const s = k.update(str, 'utf8', 'hex') + k.final('hex');
        return s;
    }
    static Decrypt(str) {
        const k = crypto.createDecipher(algorithm, key);
        const s = k.update(str, 'hex', 'utf8') + k.final('utf8');
        return s;
    }
}

module.exports = EncryptDecrypt;
