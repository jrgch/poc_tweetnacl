import { Injectable } from '@nestjs/common';
import { IKeyManagerService } from '../interfaces/ikey-manager-service.interface';
import * as util from 'tweetnacl-util';

@Injectable()
export class KeyManagerService implements IKeyManagerService {

    //Clave privada de firma (solamente usada por Doushi cloud para firmar licencias)
    private readonly signingPrivateKeyCloud: Uint8Array;

    //Clave pública de firma (usada por Doushi client para validar la firma)
    private readonly signingPublicKeyCloud: Uint8Array;

    //Clave privada de cifrado (usada por Doushi cloud para cifrar la clave simétrica)
    private readonly encryptionPrivateKeyCloud: Uint8Array;

    //Clave pública de cifrado (usada por Doushi client para verificar el origen al descifrar)
    private readonly encryptionPublicKeyCloud: Uint8Array;

    //Clave privada de cifrado (usada por Doushi Client para descifrar licencias)
    private readonly encryptionPrivateKeyClient: Uint8Array;

    //Clave pública de cifrado (usada por Doushi Cloud para cifrar licencias)
    private readonly encryptionPublicKeyClient: Uint8Array;

    constructor() {

        //Validar que todas las variables de entorno estén definidas
        const envVariables = [
            'SIGNINGPRIVATEKEY_CLOUD',
            'SIGNINGPUBLICKEY_CLOUD',
            'ENCRYPTION_PRIVATE_KEY_CLOUD',
            'ENCRYPTION_PUBLIC_KEY_CLOUD',
            'ENCRYPTIONPRIVATEKEY_CLIENT',
            'ENCRYPTIONPUBLICKEY_CLIENT'
        ];

        envVariables.forEach((envVar) => {
            if (!process.env[envVar]) {
                throw new Error(`Error: La variable de entorno ${envVar} no está definida en .env`);
            }
        });

        this.signingPrivateKeyCloud = util.decodeBase64(process.env.SIGNINGPRIVATEKEY_CLOUD!);
        this.signingPublicKeyCloud = util.decodeBase64(process.env.SIGNINGPUBLICKEY_CLOUD!);
        this.encryptionPrivateKeyCloud = util.decodeBase64(process.env.ENCRYPTION_PRIVATE_KEY_CLOUD!);
        this.encryptionPublicKeyCloud = util.decodeBase64(process.env.ENCRYPTION_PUBLIC_KEY_CLOUD!);
        this.encryptionPrivateKeyClient = util.decodeBase64(process.env.ENCRYPTIONPRIVATEKEY_CLIENT!);
        this.encryptionPublicKeyClient = util.decodeBase64(process.env.ENCRYPTIONPUBLICKEY_CLIENT!);
    }

    getSigningPrivateKeyCloud(): Uint8Array {
        return this.signingPrivateKeyCloud;
    }

    getSigningPublicKeyCloud(): Uint8Array {
        return this.signingPublicKeyCloud;
    }

    getEncryptionPrivateKeyCloud(): Uint8Array {
        return this.encryptionPrivateKeyCloud;
    }

    getEncryptionPublicKeyCloud(): Uint8Array {
        return this.encryptionPublicKeyCloud;
    }

    getEncryptionPrivateKeyClient(): Uint8Array {
        return this.encryptionPrivateKeyClient;
    }

    getEncryptionPublicKeyClient(): Uint8Array {
        return this.encryptionPublicKeyClient;
    }
}
