// backend/src/core/keychain.js

import {
  deriveMasterKey,
  deriveSubKeys,
  encryptAESGCM,
  decryptAESGCM,
  computeHMAC,
  generateSalt,
  generateIV,
} from "./cryptoUtils.js";

import {
  strToBuf,
  bufToStr,
  bufToBase64,
  base64ToBuf,
} from "./encodingUtils.js";

import {
  computeSHA256,
  verifyChecksum,
} from "./integrity.js";

import {
  SALT_LENGTH,
  PBKDF2_ITERATIONS,
  MAX_PASSWORD_LENGTH,
} from "./constants.js";

/**
 * Keychain Class
 * ----------------
 * Manages secure domain-password storage using AES-GCM + HMAC + PBKDF2.
 */
export class Keychain {
  /**
   * For testing: derive and print the PBKDF2 master key for a given password and salt.
   * Output is Base64 (can be changed to hex if needed).
   */
  static async printMasterKey(password, salt = null, iterations = PBKDF2_ITERATIONS) {
    if (!salt) salt = generateSalt(SALT_LENGTH);
    const masterKey = await deriveMasterKey(password, salt, iterations);
    // Export raw key material
    const raw = await crypto.subtle.exportKey('raw', masterKey);
    // Convert to Base64
    const base64 = btoa(String.fromCharCode(...new Uint8Array(raw)));
    console.log('PBKDF2 output (master key):', base64);
    return base64;
  }
  /**
   * Returns a description of PBKDF2 rounds and their security purpose.
   * For testing/documentation only.
   */
  static pbkdf2Info() {
    return `PBKDF2 performed ${PBKDF2_ITERATIONS.toLocaleString()} rounds of cryptographic hashing on your password combined with the salt. Why so many rounds? To make it painfully slow for attackers trying to guess your password. If someone tries to brute-force your password by guessing millions of possibilities, each guess takes about half a second to verify. This turns a quick attack into something that would take years.`;
  }
  constructor(aesKey, hmacKey, kvs = {}, salt = null, iterations = PBKDF2_ITERATIONS) {
    this.aesKey = aesKey;
    this.hmacKey = hmacKey;
    this.kvs = kvs;
    this.salt = salt;
    this.iterations = iterations;
  }

  // Initialize a new keychain
  static async init(password) {
    const salt = generateSalt(SALT_LENGTH);
    const masterKey = await deriveMasterKey(password, salt);
    const { aesKey, hmacKey } = await deriveSubKeys(masterKey);
    return new Keychain(aesKey, hmacKey, {}, bufToBase64(salt), PBKDF2_ITERATIONS);
  }

  // Load existing keychain
  static async load(password, repr, trustedDataCheck = null) {
    const data = JSON.parse(repr);

    if (trustedDataCheck) {
      const valid = await verifyChecksum(repr, trustedDataCheck);
      if (!valid) throw new Error("Checksum mismatch: possible rollback attack.");
    }

    const salt = base64ToBuf(data.salt);
    const masterKey = await deriveMasterKey(password, salt, data.iterations);
    const { aesKey, hmacKey } = await deriveSubKeys(masterKey);

    const kc = new Keychain(aesKey, hmacKey, data.kvs, data.salt, data.iterations);

    // Test decryption of first entry (if any)
    const keys = Object.keys(kc.kvs);
    if (keys.length > 0) {
      try {
        const testKey = keys[0];
        const testEntry = kc.kvs[testKey];
        await decryptAESGCM(
          kc.aesKey,
          base64ToBuf(testEntry.ciphertext),
          base64ToBuf(testEntry.iv),
          base64ToBuf(testKey)
        );
      } catch (err) {
        throw new Error("Incorrect password or corrupted data.");
      }
    }

    return kc;
  }

  // Dump keychain to JSON + SHA256 checksum
  async dump() {
    try {
      const json = JSON.stringify({
        kvs: this.kvs,
        salt: this.salt,
        iterations: this.iterations,
      });
      const checksum = await computeSHA256(json);
      return [json, checksum];
    } catch (err) {
      throw new Error(`Failed to dump keychain: ${err.message}`);
    }
  }

  // Add or update a password
  async set(domain, password) {
    try {
      const domainBuf = strToBuf(domain);
      const domainHMAC = await computeHMAC(this.hmacKey, domainBuf);
      const domainKey = bufToBase64(domainHMAC);

      const padded = password.padEnd(MAX_PASSWORD_LENGTH, " ");
      const passwordBuf = strToBuf(padded);

      const iv = generateIV();
      const ciphertext = await encryptAESGCM(
        this.aesKey,
        passwordBuf,
        iv,
        domainHMAC
      );

      this.kvs[domainKey] = {
        ciphertext: bufToBase64(ciphertext),
        iv: bufToBase64(iv),
      };
    } catch (err) {
      throw new Error(`Failed to set password for domain '${domain}': ${err.message}`);
    }
  }

  // Retrieve password; return null if not found
  async get(domain) {
    const domainBuf = strToBuf(domain);
    const domainHMAC = await computeHMAC(this.hmacKey, domainBuf);
    const domainKey = bufToBase64(domainHMAC);

    const entry = this.kvs[domainKey];
    if (!entry) return null;

    try {
      const plaintextBuf = await decryptAESGCM(
        this.aesKey,
        base64ToBuf(entry.ciphertext),
        base64ToBuf(entry.iv),
        domainHMAC
      );
      return bufToStr(plaintextBuf).trimEnd();
    } catch (err) {
      throw new Error(`Failed to retrieve password for domain '${domain}': ${err.message}`);
    }
  }

  // Remove password; return false if not found
  async remove(domain) {
    const domainBuf = strToBuf(domain);
    const domainHMAC = await computeHMAC(this.hmacKey, domainBuf);
    const domainKey = bufToBase64(domainHMAC);

    if (!this.kvs[domainKey]) return false;

    try {
      delete this.kvs[domainKey];
      return true;
    } catch (err) {
      throw new Error(`Failed to remove password for domain '${domain}': ${err.message}`);
    }
  }
}
