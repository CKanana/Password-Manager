// manualTest.js
// Interactive backend test for password manager logic (no frontend required)
import readline from 'readline';
import { Keychain } from './core/keychain.js';
import fs from 'fs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  rl.question('Do you want to (1) create a new vault or (2) load an existing vault? Enter 1 or 2: ', async (choice) => {
    rl.question('Enter master password: ', async (masterPassword) => {
      let keychain;
      let vaultFile = 'vault.json';
      if (choice === '2') {
        if (fs.existsSync(vaultFile)) {
          // Load vault from file
          const vaultData = JSON.parse(fs.readFileSync(vaultFile, 'utf8'));
          try {
            keychain = await Keychain.load(masterPassword, vaultData.json, vaultData.checksum);
            console.log('Vault loaded.');
          } catch (err) {
            console.log('Failed to load vault:', err.message);
            rl.close();
            return;
          }
        } else {
          console.log('No existing vault found. Creating a new vault.');
          keychain = await Keychain.init(masterPassword);
        }
      } else {
        // Create new vault
        keychain = await Keychain.init(masterPassword);
        console.log('New vault created.');
      }
      console.log('Salt (Base64):', keychain.salt);
      rl.question('Enter domain to store: ', async (domain) => {
        rl.question('Enter password for domain: ', async (domainPassword) => {
          // Show original password
          console.log('Original password:', domainPassword);
          // Show padded password
          const padded = domainPassword.padEnd(64, ' ');
          console.log('Padded password:', JSON.stringify(padded));

          // Hash domain name
          const { strToBuf, bufToBase64 } = await import('./core/encodingUtils.js');
          const { computeHMAC, generateIV, encryptAESGCM } = await import('./core/cryptoUtils.js');
          const domainBuf = strToBuf(domain);
          const domainHMAC = await computeHMAC(keychain.hmacKey, domainBuf);
          const domainKey = bufToBase64(domainHMAC);
          console.log('Hashed domain name:', domainKey);

          // Generate IV
          const iv = generateIV();
          console.log('Random IV (Base64):', bufToBase64(iv));

          // Encrypt password
          const passwordBuf = strToBuf(padded);
          const ciphertext = await encryptAESGCM(keychain.aesKey, passwordBuf, iv, domainHMAC);
          const ciphertextBase64 = bufToBase64(new Uint8Array(ciphertext));
          console.log('Encrypted password (ciphertext, Base64):', ciphertextBase64);

          // Store password
          keychain.kvs[domainKey] = { ciphertext: ciphertextBase64, iv: bufToBase64(iv) };
          console.log('Database entry:', JSON.stringify({ [domainKey]: keychain.kvs[domainKey] }, null, 2));
          console.log('Password stored.');

          // Save vault to file
          const [json, checksum] = await keychain.dump();
          fs.writeFileSync(vaultFile, JSON.stringify({ json, checksum }, null, 2));
          console.log('Vault saved to', vaultFile);

          // Retrieve password
          const entry = keychain.kvs[domainKey];
          console.log('Retrieving password for domain:', domain);
          console.log('Lookup domain hash:', domainKey);
          console.log('Retrieved ciphertext:', entry.ciphertext);
          console.log('Retrieved IV:', entry.iv);
          const decryptedBuf = await import('./core/cryptoUtils.js').then(m => m.decryptAESGCM(keychain.aesKey, new Uint8Array(Buffer.from(entry.ciphertext, 'base64')), new Uint8Array(Buffer.from(entry.iv, 'base64')), domainHMAC));
          const { bufToStr } = await import('./core/encodingUtils.js');
          const decryptedPadded = bufToStr(decryptedBuf);
          console.log('Decrypted padded password:', JSON.stringify(decryptedPadded));
          console.log('Final unpadded password:', decryptedPadded.trimEnd());

          rl.question('Do you want to remove this domain? (y/n): ', async (answer) => {
            if (answer.toLowerCase() === 'y') {
              const removed = await keychain.remove(domain);
              console.log(removed ? 'Domain removed.' : 'Domain not found.');
              // Save vault after removal
              const [json, checksum] = await keychain.dump();
              fs.writeFileSync(vaultFile, JSON.stringify({ json, checksum }, null, 2));
              console.log('Vault updated and saved to', vaultFile);
            }
            rl.close();
          });
        });
      });
    });
  });
}

main();
