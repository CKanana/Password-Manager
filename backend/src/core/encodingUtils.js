// backend/src/core/encodingUtils.js

/**
 * encodingUtils.js
 * ----------------
 * Handles encoding and decoding between:
 *  - Strings ↔ ArrayBuffers
 *  - ArrayBuffers ↔ Base64
 *  - Buffer concatenation
 *
 * Ensures clean conversions for cryptographic data processing.
 */

// ---------------------------------------------------------------------------
// 1. String ↔ ArrayBuffer
// ---------------------------------------------------------------------------

/**
 * Converts a string to an ArrayBuffer using UTF-8 encoding.
 * @param {string} str - Input string.
 * @returns {ArrayBuffer}
 */
export function strToBuf(str) {
  return new TextEncoder().encode(str).buffer;
}

/**
 * Converts an ArrayBuffer to a UTF-8 string.
 * @param {ArrayBuffer} buf - Input ArrayBuffer.
 * @returns {string}
 */
export function bufToStr(buf) {
  return new TextDecoder().decode(buf);
}

// ---------------------------------------------------------------------------
// 2. ArrayBuffer ↔ Base64
// ---------------------------------------------------------------------------

/**
 * Converts an ArrayBuffer to a Base64 string.
 * @param {ArrayBuffer} buf - Binary data to encode.
 * @returns {string} - Base64 encoded string.
 */
export function bufToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary); // browser built-in Base64 encoder
}

/**
 * Converts a Base64 string to an ArrayBuffer.
 * @param {string} b64 - Base64 encoded data.
 * @returns {ArrayBuffer}
 */
export function base64ToBuf(b64) {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// ---------------------------------------------------------------------------
//  3. Concatenate Two ArrayBuffers
// ---------------------------------------------------------------------------

/**
 * Concatenates two ArrayBuffers into a single ArrayBuffer.
 * @param {ArrayBuffer} buf1
 * @param {ArrayBuffer} buf2
 * @returns {ArrayBuffer}
 */
export function concatBuffers(buf1, buf2) {
  const a1 = new Uint8Array(buf1);
  const a2 = new Uint8Array(buf2);
  const combined = new Uint8Array(a1.length + a2.length);
  combined.set(a1, 0);
  combined.set(a2, a1.length);
  return combined.buffer;
}
