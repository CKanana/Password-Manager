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
 * Implements all cryptographic security measures specified in the project.
 */
export class Keychain {
  constructor(aesKey, hmacKey, kvs = {}, salt = null, iterations = PBKDF2_ITERATIONS) {
    this.aesKey = aesKey;           // AES-GCM key for password encryption
    this.hmacKey = hmacKey;         // HMAC key for domain hashing
    this.kvs = kvs;                 // Key-Value Store: domainHMAC → { ciphertext, iv }
    this.salt = salt;               // 128-bit salt for PBKDF2
    this.iterations = iterations;   // PBKDF2 iteration count
  }

  // ------------------------------------------------------------
  //  Initialize new password manager
  // ------------------------------------------------------------
  static async init(password) {
    const salt = generateSalt(SALT_LENGTH);
    const masterKey = await deriveMasterKey(password, salt);
    const { aesKey, hmacKey } = await deriveSubKeys(masterKey);

    return new Keychain(aesKey, hmacKey, {}, bufToBase64(salt), PBKDF2_ITERATIONS);
  }

  // ------------------------------------------------------------
  // Load existing keychain from JSON representation
  // ------------------------------------------------------------
  static async load(password, repr, trustedDataCheck = null) {
    const data = JSON.parse(repr);

    // Verify rollback protection if trustedDataCheck is provided
    if (trustedDataCheck) {
      const valid = await verifyChecksum(repr, trustedDataCheck);
      if (!valid) throw new Error("Checksum mismatch: possible rollback attack.");
    }

    const salt = base64ToBuf(data.salt);
    const masterKey = await deriveMasterKey(password, salt, data.iterations);
    const { aesKey, hmacKey } = await deriveSubKeys(masterKey);

    const kc = new Keychain(aesKey, hmacKey, data.kvs, data.salt, data.iterations);

    // Verify password correctness (try decrypting first entry if any)
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

  // ------------------------------------------------------------
  //  Save keychain to disk (serialize)
  // ------------------------------------------------------------
  async dump() {
    const json = JSON.stringify({
      kvs: this.kvs,
      salt: this.salt,
      iterations: this.iterations,
    });

    const checksum = await computeSHA256(json);
    return [json, checksum];
  }

  // ------------------------------------------------------------
  // Add or update password for a domain
  // ------------------------------------------------------------
  async set(domain, password) {
    try {
      const domainBuf = strToBuf(domain);
      const domainHMAC = await computeHMAC(this.hmacKey, domainBuf);
      const domainKey = bufToBase64(domainHMAC);

      // Pad password to fixed length
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

  // ------------------------------------------------------------
  // Retrieve password for a domain
  // ------------------------------------------------------------
  async get(domain) {
    try {
      const domainBuf = strToBuf(domain);
      const domainHMAC = await computeHMAC(this.hmacKey, domainBuf);
      const domainKey = bufToBase64(domainHMAC);

      const entry = this.kvs[domainKey];
      if (!entry) {
        throw new Error(`No password found for domain '${domain}'.`);
      }

      const plaintextBuf = await decryptAESGCM(
        this.aesKey,
        base64ToBuf(entry.ciphertext),
        base64ToBuf(entry.iv),
        domainHMAC
      );
      const plaintext = bufToStr(plaintextBuf).trimEnd();
      return plaintext;
    } catch (err) {
      throw new Error(`Failed to retrieve password for domain '${domain}': ${err.message}`);
    }
  }

  // ------------------------------------------------------------
  //  Remove password entry
  // ------------------------------------------------------------
  async remove(domain) {
    try {
      const domainBuf = strToBuf(domain);
      const domainHMAC = await computeHMAC(this.hmacKey, domainBuf);
      const domainKey = bufToBase64(domainHMAC);

      if (this.kvs[domainKey]) {
        delete this.kvs[domainKey];
        return true;
      } else {
        throw new Error(`No password found for domain '${domain}' to remove.`);
      }
    } catch (err) {
      throw new Error(`Failed to remove password for domain '${domain}': ${err.message}`);
    }
  }
}
