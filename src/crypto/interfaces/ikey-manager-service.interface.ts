export interface IKeyManagerService {
    getPrivateSigningKey(): Uint8Array;
    getPublicSigningKey(): Uint8Array;
    getPrivateEncryptionKey(): Uint8Array;
    getPublicEncryptionKey(): Uint8Array;
}
