// integrity.js
// Responsible for checksum verification and rollback protection

/**
 * Computes the SHA-256 hash of the input data and returns a Base64-encoded digest.
 * @param {string|ArrayBuffer} data - The data to hash (string or ArrayBuffer).
 * @returns {Promise<string>} - Base64-encoded SHA-256 digest.
 */
export async function computeSHA256(data) {
    let buffer;
    if (typeof data === 'string') {
        buffer = new TextEncoder().encode(data);
    } else if (data instanceof ArrayBuffer) {
        buffer = new Uint8Array(data);
    } else {
        throw new TypeError('Data must be a string or ArrayBuffer');
    }
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}

/**
 * Verifies that the SHA-256 hash of the data matches the expected Base64 digest.
 * @param {string|ArrayBuffer} data - The data to hash and verify.
 * @param {string} expectedHash - The expected Base64-encoded SHA-256 digest.
 * @returns {Promise<boolean>} - True if the hash matches, false otherwise.
 */
export async function verifyChecksum(data, expectedHash) {
    const actualHash = await computeSHA256(data);
    return actualHash === expectedHash;
}
