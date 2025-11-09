# Backend README: Password Manager

## Implemented Features
- **Keychain class** with all required methods:
  - `init(password)`: Vault creation and key derivation
  - `load(password, repr, trustedDataCheck)`: Vault loading and checksum verification
  - `dump()`: Vault serialization and checksum computation
  - `set(domain, password)`: Store encrypted, padded password
  - `get(domain)`: Retrieve and decrypt password
  - `remove(domain)`: Delete entry
- **Cryptographic primitives** (Web Crypto API only):
  - PBKDF2 for key derivation
  - HMAC-SHA256 for domain hashing
  - AES-GCM for password encryption/decryption
  - Base64 encoding/decoding
  - Password padding to 64 chars
  - Associated Data (AAD) for swap attack protection
  - SHA-256 checksum for rollback protection
- **Exception handling**: All major methods handle errors gracefully and provide descriptive messages.
- **No plaintext secrets in serialized data**: Only encrypted data, salt, and iteration count are stored.
- **Unit tests** (`testIntegrity.js`):
  - Padding/unpadding
  - Encryption/decryption roundtrip
  - HMAC determinism
  - Checksum detection
  - Keychain dump/load and rollback protection
- **Manual test script** (`manualTest.js`): Interactive backend testing via terminal

## Remaining Work
- **Frontend integration**: Connect backend logic to frontend UI for user interaction
- **Frontend implementation**: Build `index.html`, `style.css`, and `app.js` for vault management, password entry, and UI features
- **Documentation/report**: Write project report, answer security questions, and provide screenshots
- **Optional features**: Password strength estimation, dark mode, autofill, passphrase generator, localStorage auto-save

## Notes
- All cryptographic operations use the Web Crypto API (`crypto.subtle`).
- No external crypto libraries are used.
- All sensitive operations are client-side and offline.

---
For details on frontend requirements, see `frontend/README.md`.
