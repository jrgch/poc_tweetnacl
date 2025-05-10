export interface IKeyManagerService {
    getSigningPrivateKeyCloud(): Uint8Array;
    getSigningPublicKeyCloud(): Uint8Array;
    getEncryptionPrivateKeyCloud(): Uint8Array;
    getEncryptionPublicKeyCloud(): Uint8Array;
    getEncryptionPrivateKeyClient(): Uint8Array;
    getEncryptionPublicKeyClient(): Uint8Array;
}
