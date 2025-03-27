import { Injectable } from '@nestjs/common';
import { IKeyManagerService } from '../interfaces/ikey-manager-service.interface';
import * as util from 'tweetnacl-util';

@Injectable()
export class KeyManagerService implements IKeyManagerService {
    //Clave privada de firma (solo usada para firmar licencias)
    private readonly privateSigningKey: Uint8Array;
    
    //Clave pública de firma (usada para validar la firma)
    private readonly publicSigningKey: Uint8Array;
    
    //Clave privada de cifrado (usada para descifrar licencias)
    private readonly privateEncryptionKey: Uint8Array;

    //Clave pública de cifrado (usada para cifrar licencias)
    private readonly publicEncryptionKey: Uint8Array;

    constructor() {

        //Validar que todas las variables de entorno estén definidas
        const envVariables = [
            'PRIVATE_SIGNING_KEY',
            'PUBLIC_SIGNING_KEY',
            'PRIVATE_ENCRYPTION_KEY',
            'PUBLIC_ENCRYPTION_KEY',
        ];

        envVariables.forEach((envVar) => {
            if (!process.env[envVar]) {
                throw new Error(`Error: La variable de entorno ${envVar} no está definida en .env`);
            }
        });

        this.privateSigningKey = util.decodeBase64(process.env.PRIVATE_SIGNING_KEY!);
        this.publicSigningKey = util.decodeBase64(process.env.PUBLIC_SIGNING_KEY!);
        this.privateEncryptionKey = util.decodeBase64(process.env.PRIVATE_ENCRYPTION_KEY!);
        this.publicEncryptionKey = util.decodeBase64(process.env.PUBLIC_ENCRYPTION_KEY!);
    }

    getPrivateSigningKey(): Uint8Array {
        return this.privateSigningKey;
    }
    
    getPublicSigningKey(): Uint8Array {
        return this.publicSigningKey;
    }

    getPrivateEncryptionKey(): Uint8Array {
        return this.privateEncryptionKey;
    }

    getPublicEncryptionKey(): Uint8Array {
        return this.publicEncryptionKey;
    }
}
