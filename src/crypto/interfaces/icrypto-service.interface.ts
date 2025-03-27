export interface ICryptoService {
    signAndEncrypt(data: string): Promise<string>;
    decryptAndVerify(encryptedData: string): Promise<{ data: string; valid: boolean }>;
}
