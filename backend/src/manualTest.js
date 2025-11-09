// manualTest.js
// Interactive backend test for password manager logic (no frontend required)
import readline from 'readline';
import { Keychain } from './core/keychain.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  rl.question('Enter master password: ', async (masterPassword) => {
    const keychain = await Keychain.init(masterPassword);
    console.log('Vault created.');
    rl.question('Enter domain to store: ', async (domain) => {
      rl.question('Enter password for domain: ', async (domainPassword) => {
        await keychain.set(domain, domainPassword);
        console.log('Password stored.');
        const retrieved = await keychain.get(domain);
        console.log('Retrieved password:', retrieved);
        rl.question('Do you want to remove this domain? (y/n): ', async (answer) => {
          if (answer.toLowerCase() === 'y') {
            const removed = await keychain.remove(domain);
            console.log(removed ? 'Domain removed.' : 'Domain not found.');
          }
          rl.close();
        });
      });
    });
  });
}

main();
