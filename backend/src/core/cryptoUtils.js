// backend/src/core/cryptoUtils.js

/**
 * cryptoUtils.js
 * ----------------
 * Provides cryptographic primitives for the Secure Password Manager.
 * Implements:
 *  - PBKDF2 key derivation
 *  - HMAC-SHA256 (for domain hashing)
 *  - AES-GCM encryption/decryption
 *  - Random salt and IV generation
 *  - Subkey derivation (enc + mac)
 */

import {
  PBKDF2_ITERATIONS,
  PBKDF2_HASH,
  AES_ALGO,
  HMAC_ALGO,
  SALT_LENGTH,
  IV_LENGTH,
} from "./constants.js";

// ---------------------------------------------------------------------------
//  Key Derivation using PBKDF2
// ---------------------------------------------------------------------------

/**
 * Derives a master key from a password and salt using PBKDF2.
 * @param {string} password - The user's master password.
 * @param {ArrayBuffer} salt - Random salt (128-bit).
 * @param {number} iterations - PBKDF2 iterations (default: 100,000).
 * @returns {CryptoKey} - Derived master key.
 */
export async function deriveMasterKey(password, salt, iterations = PBKDF2_ITERATIONS) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  const masterKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: iterations,
      hash: PBKDF2_HASH,
    },
    keyMaterial,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    true,
    ["sign"]
  );

  return masterKey; // used as base to derive subkeys
}

// ---------------------------------------------------------------------------
// Subkey Derivation (AES key + HMAC key)
// ---------------------------------------------------------------------------

/**
 * Derives two independent subkeys (encryption + HMAC) from the master key.
 * Uses HMAC(masterKey, label) for domain separation.
 * @param {CryptoKey} masterKey - The PBKDF2-derived master key.
 * @returns {Object} - { aesKey, hmacKey }
 */
export async function deriveSubKeys(masterKey) {
  const enc = new TextEncoder();

  // Derive AES key
  const aesKeyMaterial = await crypto.subtle.sign(
    "HMAC",
    masterKey,
    enc.encode("enc")
  );

  const aesKey = await crypto.subtle.importKey(
    "raw",
    aesKeyMaterial,
    { name: AES_ALGO },
    false,
    ["encrypt", "decrypt"]
  );

  // Derive HMAC key
  const hmacKeyMaterial = await crypto.subtle.sign(
    "HMAC",
    masterKey,
    enc.encode("mac")
  );

  const hmacKey = await crypto.subtle.importKey(
    "raw",
    hmacKeyMaterial,
    { name: HMAC_ALGO, hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );

  return { aesKey, hmacKey };
}

// ---------------------------------------------------------------------------
//  Domain HMAC (used for hashing domain names)
// ---------------------------------------------------------------------------

/**
 * Computes HMAC-SHA256 for the given data.
 * @param {CryptoKey} hmacKey - Imported HMAC key.
 * @param {ArrayBuffer} data - Data to authenticate.
 * @returns {ArrayBuffer} - HMAC digest.
 */
export async function computeHMAC(hmacKey, data) {
  const mac = await crypto.subtle.sign("HMAC", hmacKey, data);
  return mac;
}

// ---------------------------------------------------------------------------
//  AES-GCM Encryption / Decryption
// ---------------------------------------------------------------------------

/**
 * Encrypts data using AES-GCM.
 * @param {CryptoKey} aesKey - AES-GCM key.
 * @param {ArrayBuffer} plaintext - Data to encrypt.
 * @param {Uint8Array} iv - Initialization Vector (12 bytes).
 * @param {ArrayBuffer} aad - Additional Authenticated Data (e.g., domain HMAC).
 * @returns {ArrayBuffer} - Ciphertext (includes authentication tag).
 */
export async function encryptAESGCM(aesKey, plaintext, iv, aad = null) {
  const algo = { name: AES_ALGO, iv: iv, additionalData: aad };
  const ciphertext = await crypto.subtle.encrypt(algo, aesKey, plaintext);
  return ciphertext;
}

/**
 * Decrypts data using AES-GCM.
 * @param {CryptoKey} aesKey - AES-GCM key.
 * @param {ArrayBuffer} ciphertext - Data to decrypt.
 * @param {Uint8Array} iv - Initialization Vector.
 * @param {ArrayBuffer} aad - Authenticated Data used during encryption.
 * @returns {ArrayBuffer} - Decrypted plaintext.
 */
export async function decryptAESGCM(aesKey, ciphertext, iv, aad = null) {
  const algo = { name: AES_ALGO, iv: iv, additionalData: aad };
  const plaintext = await crypto.subtle.decrypt(algo, aesKey, ciphertext);
  return plaintext;
}

// ---------------------------------------------------------------------------
//Random Salt and IV Generation
// ---------------------------------------------------------------------------

/**
 * Generates a random salt of given length.
 * @param {number} length - Salt length in bytes (default: 16).
 * @returns {Uint8Array} - Random salt.
 */
export function generateSalt(length = SALT_LENGTH) {
  const salt = new Uint8Array(length);
  crypto.getRandomValues(salt);
  return salt;
}

/**
 * Generates a random 12-byte IV for AES-GCM.
 * @returns {Uint8Array} - Random IV.
 */
export function generateIV() {
  const iv = new Uint8Array(IV_LENGTH);
  crypto.getRandomValues(iv);
  return iv;
}
