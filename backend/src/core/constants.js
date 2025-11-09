// backend/src/core/constants.js

/**
 * constants.js
 * ----------------
 * Contains cryptographic and system constants used throughout
 * the Secure Password Manager backend.
 * 
 * Keeping constants centralized improves maintainability, readability,
 * and ensures consistency across modules.
 */

// ---------------------------------------------------------------------------
//  Key Derivation (PBKDF2)
// ---------------------------------------------------------------------------

/**
 * PBKDF2 iteration count — defines password hardening cost.
 * Higher values increase security but make key derivation slower.
 */
export const PBKDF2_ITERATIONS = 100000;

/**
 * PBKDF2 hash algorithm.
 * SHA-256 is a strong, modern choice.
 */
export const PBKDF2_HASH = "SHA-256";

/**
 * Salt length in bytes.
 * 16 bytes = 128 bits of randomness.
 */
export const SALT_LENGTH = 16; // 128-bit

// ---------------------------------------------------------------------------
// AES-GCM Encryption
// ---------------------------------------------------------------------------

/**
 * AES-GCM algorithm identifier for Web Crypto API.
 */
export const AES_ALGO = "AES-GCM";

/**
 * Initialization Vector (IV) length in bytes.
 * 12 bytes (96 bits) is the recommended size for AES-GCM.
 */
export const IV_LENGTH = 12; // 96-bit

// ---------------------------------------------------------------------------
//  HMAC Parameters
// ---------------------------------------------------------------------------

/**
 * HMAC algorithm used for domain hashing and key derivation.
 */
export const HMAC_ALGO = "HMAC";

// ---------------------------------------------------------------------------
//  Password Formatting
// ---------------------------------------------------------------------------

/**
 * Maximum password length (after padding).
 * Passwords are padded to this length to hide their true size.
 */
export const MAX_PASSWORD_LENGTH = 64;

// ---------------------------------------------------------------------------
//  Other Utility Settings (optional future additions)
// ---------------------------------------------------------------------------

/**
 * SHA-256 digest length (in bytes).
 * Can be useful if verifying digests or truncating hashes.
 */
export const SHA256_DIGEST_LENGTH = 32;

/**
 * Encapsulation for encoding standards.
 * UTF-8 is mandatory for text encoding.
 */
export const TEXT_ENCODING = "utf-8";
