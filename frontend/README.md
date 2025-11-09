# Frontend Overview for Password Manager

## Purpose
This frontend provides a clean, responsive user interface for securely managing domain–password pairs using the backend cryptographic logic. It interacts with the backend (Keychain class and related modules) entirely in the browser, ensuring all sensitive operations are client-side and offline.

## Key Features
- **Master Key Interface**: Create a new vault or unlock an existing one using a master password.
- **Password Management Dashboard**: Add, view, copy, and delete domain-password entries. Passwords are never stored in plaintext.
- **Password Strength Indicator**: Shows password strength and allows toggling visibility.
- **Export/Import Vault**: Download/upload encrypted vault data and checksum for backup and restore.
- **UI Enhancements**: Modern design (TailwindCSS or custom CSS), responsive layout, optional dark mode, and smooth animations.

## Implementation Notes
- All cryptographic operations (key derivation, encryption, HMAC, checksum) use the Web Crypto API via the backend JS modules.
- The frontend should import and use the Keychain class for all password management actions.
- No sensitive data is sent to any server; everything runs offline in the browser.
- Exception handling and user feedback (toasts, modals) should be implemented for all actions.



## Integration Points
- `app.js` should call Keychain methods for vault creation, loading, password set/get/remove, and export/import.
- UI events (form submissions, button clicks) should trigger backend actions and update the interface accordingly.

## Security
- Never store or display plaintext passwords or keys.
- All data export/import should use encrypted vault data and checksum only.
- Handle all errors gracefully and inform the user.

## Reference
See the backend README and code comments for details on cryptographic logic and security requirements.

---

