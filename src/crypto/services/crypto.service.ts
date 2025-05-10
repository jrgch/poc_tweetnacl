import { Injectable } from '@nestjs/common';
import * as nacl from 'tweetnacl';
import * as util from 'tweetnacl-util';
import { ICryptoService } from '../interfaces/icrypto-service.interface';
import { KeyManagerService } from './key-manager.service';
import { CRYPTO_CONFIG } from '../crypto.config';

@Injectable()
export class CryptoService implements ICryptoService {
    constructor(private readonly keyManager: KeyManagerService) { }

    /**
     * Firma digitalmente la licencia y luego la cifra con XChaCha20-Poly1305.
     * @param data - Texto de la licencia a firmar y cifrar.
     * @returns Licencia firmada y cifrada en formato Base64.
     */
    async signAndEncrypt(data: string): Promise<string> {
        if (!data?.length) throw new Error("Datos vacíos");

        //Obtener la clave privada de firma
        const signingPrivateKeyCloud = this.keyManager.getSigningPrivateKeyCloud();

        //Firmar la licencia con Ed25519
        const dataBytes = util.decodeUTF8(data);
        const signedData = nacl.sign(dataBytes, signingPrivateKeyCloud);

        //Generar una clave secreta aleatoria para cifrado simétrico
        const secretKey = nacl.randomBytes(CRYPTO_CONFIG.SECRET_KEY_LENGTH);
        if (secretKey.length !== CRYPTO_CONFIG.SECRET_KEY_LENGTH) throw new Error("secretKey inválido");

        //Cifrar la licencia firmada con XChaCha20-Poly1305
        const nonce = nacl.randomBytes(CRYPTO_CONFIG.NONCE_LENGTH);
        if (nonce.length !== CRYPTO_CONFIG.NONCE_LENGTH) throw new Error("Nonce inválido");
        const encryptedData = nacl.secretbox(signedData, nonce, secretKey);

        //Obtener la clave pública (de Doushi client) para cifrar
        const encryptionPublicKeyClient = this.keyManager.getEncryptionPublicKeyClient();

        //Obtener la clave privada (de Doushi cloud) para cifrar
         const encryptionPrivateKeyCloud = this.keyManager.getEncryptionPrivateKeyCloud();

        //Cifrar la clave secreta de manera autenticada usando la clave pública para cifrar (Doushi client) y la clave privada para cifrar (Doushi Cloud)
        const encryptedSecretKey =
            nacl.box(secretKey, nonce, encryptionPublicKeyClient, encryptionPrivateKeyCloud);
        if (encryptedSecretKey.length !== CRYPTO_CONFIG.ENCRYPTED_SECRET_KEY_LENGTH) throw new Error("encryptedSecretKey inválido");

        //Concatenar (clave cifrada + nonce + datos cifrados) y convertir a Base64
        return util.encodeBase64(
            new Uint8Array([...encryptedSecretKey, ...nonce, ...encryptedData])
        );
    }

    /**
     * Descifra la licencia y valida su firma.
     * @param encryptedData - Licencia cifrada en formato Base64.
     * @returns Licencia descifrada y validación de firma.
     */
    async decryptAndVerify(encryptedData: string): Promise<{ data: string; valid: boolean }> {
        //Convertir datos de Base64 a Uint8Array
        const dataBuffer = util.decodeBase64(encryptedData);

        if (dataBuffer.length < CRYPTO_CONFIG.ENCRYPTED_SECRET_KEY_LENGTH + CRYPTO_CONFIG.NONCE_LENGTH) {
            throw new Error("Datos cifrados incompletos o corruptos");
        }

        //Extraer partes: Clave secreta cifrada, nonce y datos cifrados
        const encryptedSecretKey = dataBuffer.slice(0, CRYPTO_CONFIG.ENCRYPTED_SECRET_KEY_LENGTH);
        const nonce = 
        dataBuffer.slice(CRYPTO_CONFIG.ENCRYPTED_SECRET_KEY_LENGTH, CRYPTO_CONFIG.ENCRYPTED_SECRET_KEY_LENGTH + CRYPTO_CONFIG.NONCE_LENGTH);
        const encryptedPayload = dataBuffer.slice(CRYPTO_CONFIG.ENCRYPTED_SECRET_KEY_LENGTH + CRYPTO_CONFIG.NONCE_LENGTH);

        //Obtener clave privada (Doushi client) para descifrar
        const encryptionPrivateKeyClient = this.keyManager.getEncryptionPrivateKeyClient();

        //Obtener clave pública (Doushi cloud) para descifrar, con el objetivo de verificar el origen
        const encryptionPublicKeyCloud = this.keyManager.getEncryptionPublicKeyCloud();

        //Descifrar la clave secreta
        const decryptedSecretKey =
            nacl.box.open(encryptedSecretKey, nonce, encryptionPublicKeyCloud, encryptionPrivateKeyClient);

        if (!decryptedSecretKey) throw new Error('Clave secreta inválida');

        //Descifrar la licencia firmada
        const decryptedSignedData = nacl.secretbox.open(encryptedPayload, nonce, decryptedSecretKey);
        if (!decryptedSignedData) throw new Error('Datos corruptos o alterados');

        //Obtener clave pública de firma para verificar firma
        const signingPublicKeyCloud = this.keyManager.getSigningPublicKeyCloud();

        //Validar la firma
        const verifiedData = nacl.sign.open(decryptedSignedData, signingPublicKeyCloud);
        if (!verifiedData) throw new Error('Firma inválida');

        return { data: util.encodeUTF8(verifiedData), valid: true };
    }
}