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
    await testCryptoOutputs();
    await demoFullCycle();
    console.log('All backend tests passed');
}

// Uncomment to run directly

async function demoFullCycle() {
    console.log('\n--- DEMO: Full Password Manager Cycle ---');
    const masterPassword = '682212';
    const domain = 'google.com';
    const domainPassword = '682212';

    // Master password transformation logs
    // 1. Generate salt
    const kc = await Keychain.init(masterPassword);
    const salt = kc.salt;
    console.log('Output 1: Random Salt (Base64):', salt);

    // 2. PBKDF2 master key
    const saltBuf = base64ToBuf(salt);
    const masterKey = await deriveMasterKey(masterPassword, saltBuf);
    const masterKeyRaw = await crypto.subtle.exportKey('raw', masterKey);
    console.log('Output 2: Master Key (Base64):', btoa(String.fromCharCode(...new Uint8Array(masterKeyRaw))));

    // 3. Subkey derivation
    const { aesKey, hmacKey } = await deriveSubKeys(masterKey);
    const hmacKeyRaw = await crypto.subtle.exportKey('raw', hmacKey);
    const aesKeyRaw = await crypto.subtle.exportKey('raw', aesKey);
    console.log('Output 3: HMAC Key (Base64):', btoa(String.fromCharCode(...new Uint8Array(hmacKeyRaw))));
    console.log('Output 4: AES Key (Base64):', btoa(String.fromCharCode(...new Uint8Array(aesKeyRaw))));

    // Password storage logs
    // 5. Hash domain name
    const domainBuf = strToBuf(domain);
    const domainHMAC = await kc.constructor.prototype.computeHMAC.call(kc, hmacKey, domainBuf);
    const domainKey = bufToBase64(domainHMAC);
    console.log('Output 5: Hashed Domain Name:', domainKey);

    // 6. Original password
    console.log('Output 6: Original Password:', domainPassword);

    // 7. Padded password
    const padded = domainPassword.padEnd(64, ' ');
    console.log('Output 7: Padded Password:', JSON.stringify(padded));

    // 8. Generate IV
    const iv = generateIV();
    console.log('Output 8: Random IV (Base64):', btoa(String.fromCharCode(...iv)));

    // 9. Encrypt password
    const passwordBuf = strToBuf(padded);
    const ciphertext = await encryptAESGCM(aesKey, passwordBuf, iv, domainHMAC);
    const ciphertextBase64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
    console.log('Output 9: Encrypted Password (Ciphertext, Base64):', ciphertextBase64);

    // 10. Complete database entry
    kc.kvs[domainKey] = { ciphertext: ciphertextBase64, iv: btoa(String.fromCharCode(...iv)) };
    const entry = kc.kvs[domainKey];
    console.log('Output 10: Complete Database Entry:', JSON.stringify({ [domainKey]: entry }, null, 2));

    // Password retrieval logs
    // 11. Domain hash (lookup)
    const lookupDomainHMAC = await kc.constructor.prototype.computeHMAC.call(kc, hmacKey, domainBuf);
    const lookupDomainKey = bufToBase64(lookupDomainHMAC);
    console.log('Output 11: Domain Hash (lookup):', lookupDomainKey);

    // 12. Retrieved ciphertext and IV
    const retrievedEntry = kc.kvs[lookupDomainKey];
    console.log('Output 12: Retrieved Ciphertext:', retrievedEntry.ciphertext);
    console.log('Output 12: Retrieved IV:', retrievedEntry.iv);

    // 13. Decrypted padded password
    const decryptedBuf = await decryptAESGCM(aesKey, new Uint8Array(atob(retrievedEntry.ciphertext).split('').map(c => c.charCodeAt(0))), new Uint8Array(atob(retrievedEntry.iv).split('').map(c => c.charCodeAt(0))), domainHMAC);
    const decryptedPadded = bufToStr(decryptedBuf);
    console.log('Output 13: Decrypted Padded Password:', JSON.stringify(decryptedPadded));

    // 14. Final unpadded password
    console.log('Output 14: Final Unpadded Password:', decryptedPadded.trimEnd());

    // Security features
    // 15. SHA-256 checksum
    const [json, checksum] = await kc.dump();
    console.log('Output 15: Serialized Vault:', json);
    console.log('Output 15: SHA-256 Checksum:', checksum);

    // 16. Swap attack protection
    try {
        const wrongDomain = 'facebook.com';
        const wrongDomainBuf = strToBuf(wrongDomain);
        const wrongDomainHMAC = await kc.constructor.prototype.computeHMAC.call(kc, hmacKey, wrongDomainBuf);
        await decryptAESGCM(aesKey, new Uint8Array(atob(entry.ciphertext).split('').map(c => c.charCodeAt(0))), new Uint8Array(atob(entry.iv).split('').map(c => c.charCodeAt(0))), wrongDomainHMAC);
        console.log('Output 16: Swap attack protection FAILED (should not happen)');
    } catch (err) {
        console.log('Output 16: Swap attack protection PASSED:', err.message);
    }

    // 17. Rollback attack protection
    const [json1, checksum1] = await kc.dump();
    await kc.set('facebook.com', 'fbpassword');
    const [json2, checksum2] = await kc.dump();
    let rollbackError = false;
    try {
        await Keychain.load(masterPassword, json1, checksum2);
    } catch (err) {
        rollbackError = true;
        console.log('Output 17: Rollback attack protection PASSED:', err.message);
    }
    if (!rollbackError) console.log('Output 17: Rollback attack protection FAILED');

    // 18. Wrong password detection
    let wrongPwError = false;
    try {
        await Keychain.load('wrongpassword', json2, checksum2);
    } catch (err) {
        wrongPwError = true;
        console.log('Output 18: Wrong password detection PASSED:', err.message);
    }
    if (!wrongPwError) console.log('Output 18: Wrong password detection FAILED');

    // 19. Full serialized vault
    console.log('Output 19: Full Serialized Vault:', json2);
    console.log('--- END DEMO ---\n');
}
// Print cryptographic outputs for inspection

async function testCryptoOutputs() {
    const password = 'TestPassword123!';
    // Output 1: The Random Salt
    const salt = generateSalt();
    console.log('Output 1: Random Salt (Base64):', btoa(String.fromCharCode(...salt)));

    // Output 2: The Master Key (HMAC-capable)
    const masterKey = await deriveMasterKey(password, salt);
    const masterKeyRaw = await crypto.subtle.exportKey('raw', masterKey);
    console.log('Output 2: Master Key (Base64):', btoa(String.fromCharCode(...new Uint8Array(masterKeyRaw))));

    // Output 3 & 4: Subkeys
    const { aesKey, hmacKey } = await deriveSubKeys(masterKey);
    const hmacKeyRaw = await crypto.subtle.exportKey('raw', hmacKey);
    console.log('Output 3: HMAC Key (Base64):', btoa(String.fromCharCode(...new Uint8Array(hmacKeyRaw))));
    const aesKeyRaw = await crypto.subtle.exportKey('raw', aesKey);
    console.log('Output 4: AES Key (Base64):', btoa(String.fromCharCode(...new Uint8Array(aesKeyRaw))));
}
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

runAllTests();
