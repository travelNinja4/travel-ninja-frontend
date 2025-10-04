import crypto from 'crypto';

const publicKey = process.env.NEXT_PUBLIC_RSA_PUBLIC_KEY as string;
const privateKey = process.env.RSA_PRIVATE_KEY as string;

/**
 * Encrypts a string value using RSA public key encryption (OAEP with SHA-256).
 * @param {string} value - The plaintext string to encrypt.
 * @returns {string} The encrypted value, encoded in base64.
 */
function encryptValue(value: string): string {
  const buffer = Buffer.from(value, 'utf8');
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer,
  );
  return encrypted.toString('base64');
}

/**
 * Decrypts a string value using RSA private key decryption (OAEP with SHA-256).
 *
 * @param {string} encryptedValue - The encrypted value in base64 format.
 * @returns {string} The decrypted plaintext string.
 */
function decryptValue(encryptedValue: string): string {
  const buffer = Buffer.from(encryptedValue, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer,
  );
  return decrypted.toString('utf8');
}

/**
 * Encrypts specific string fields in an object using RSA public key encryption.
 *
 * @param {T} data - The object containing fields to encrypt.
 * @param {string[]} keysToEncrypt - The keys of the object that should be encrypted.
 * @returns {T} A new object with the specified fields encrypted.
 */
export function encryptObject<T extends Record<string, any>>(data: T, keysToEncrypt: string[]): T {
  const result: Record<string, any> = { ...data };

  keysToEncrypt.forEach((key) => {
    if (result[key] && typeof result[key] === 'string') {
      result[key] = encryptValue(result[key]);
    }
  });

  return result as T;
}

/**
 * Decrypts specific string fields in an object using RSA private key decryption.
 *
 * @param {T} data - The object containing fields to decrypt.
 * @param {string[]} keysToDecrypt - The keys of the object that should be decrypted.
 * @returns {T} A new object with the specified fields decrypted.
 */
export function decryptObject<T extends Record<string, any>>(data: T, keysToDecrypt: string[]): T {
  const result: Record<string, any> = { ...data };

  keysToDecrypt.forEach((key) => {
    if (result[key] && typeof result[key] === 'string') {
      result[key] = decryptValue(result[key]);
    }
  });

  return result as T;
}
