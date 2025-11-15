// testIntegrity.js
// Unit tests for backend correctness: padding, encryption, HMAC, checksum
import { computeSHA256, verifyChecksum } from '../backend/src/core/integrity.js';


function padPassword(password, length = 64) {
    return password.padEnd(length, '\0');
}
function unpadPassword(padded) {
    return padded.replace(/\0+$/, '');
}

async function testPadding() {
    const pw = 'secret123';
    const padded = padPassword(pw);
    const unpadded = unpadPassword(padded);
    console.assert(padded.length === 64, 'Padding failed: incorrect length');
    console.assert(unpadded === pw, 'Unpadding failed: incorrect value');
    console.log('Padding/unpadding test passed');
}

async function testEncryptionRoundtrip() {
    // Minimal AES-GCM roundtrip test
    const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const pw = padPassword('roundtrip');
    const enc = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(pw));
    const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, enc);
    const result = unpadPassword(new TextDecoder().decode(dec));
    console.assert(result === 'roundtrip', 'Encryption/decryption roundtrip failed');
    console.log('Encryption/decryption roundtrip test passed');
}

async function testHMACDeterminism() {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode('key'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const msg = 'domain.com';
    const hmac1 = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg));
    const hmac2 = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg));
    console.assert(btoa(String.fromCharCode(...new Uint8Array(hmac1))) === btoa(String.fromCharCode(...new Uint8Array(hmac2))), 'HMAC determinism failed');
    console.log('HMAC determinism test passed');
}

async function testChecksumDetection() {
    const data = JSON.stringify({ a: 1, b: 2 });
    const hash = await computeSHA256(data);
    const valid = await verifyChecksum(data, hash);
    const invalid = await verifyChecksum(data + 'x', hash);
    console.assert(valid, 'Checksum verification failed');
    console.assert(!invalid, 'Checksum detection failed');
    console.log('Checksum detection test passed');
}

export async function runAllTests() {
    await testPadding();
    await testEncryptionRoundtrip();
    await testHMACDeterminism();
    await testChecksumDetection();
    await testKeychainDumpLoad();
    console.log('All backend tests passed');
}

// Uncomment to run directly
// runAllTests();
// Test Keychain dump/load and checksum verification
import { Keychain } from '../backend/src/core/keychain.js';

async function testKeychainDumpLoad() {
    const masterPassword = 'testMaster123!';
    const domain = 'example.com';
    const domainPassword = 'SuperSecretPW!';

    // Create vault and store password
    const kc = await Keychain.init(masterPassword);
    await kc.set(domain, domainPassword);

    // Dump vault and checksum
    const [json, checksum] = await kc.dump();

    // Load vault back and verify checksum
    const loadedKc = await Keychain.load(masterPassword, json, checksum);
    const retrieved = await loadedKc.get(domain);
    console.assert(retrieved === domainPassword, 'Keychain dump/load failed: password mismatch');

    // Tamper with data and verify rollback protection
    let tamperedJson = json.replace('SuperSecretPW!', 'WrongPW!');
    let errorCaught = false;
    try {
        await Keychain.load(masterPassword, tamperedJson, checksum);
    } catch (err) {
        errorCaught = true;
        console.log('Rollback protection test passed:', err.message);
    }
    console.assert(errorCaught, 'Rollback protection failed: tampering not detected');
    console.log('Keychain dump/load and checksum test passed');
}
