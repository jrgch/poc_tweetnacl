import { Body, Controller, Post } from '@nestjs/common';
import { CryptoService } from './services/crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  /**
   * Endpoint para firmar y cifrar la licencia.
   * @param text - Licencia en texto plano.
   * @returns Licencia cifrada en formato Base64.
   */
  @Post('encrypt')
  async encrypt(@Body('text') text: string) {
    if (!text) {
      return { error: 'El texto de la licencia es obligatorio' };
    }

    const encryptedText = await this.cryptoService.signAndEncrypt(text);
    return { encryptedText };
  }

  /**
   * Endpoint para descifrar y verificar la licencia.
   * @param encryptedText - Licencia cifrada en formato Base64.
   * @returns Licencia descifrada y validación de firma.
   */
  @Post('decrypt')
  async decrypt(@Body('encryptedText') encryptedText: string) {
    if (!encryptedText) {
      return { error: 'El texto cifrado es obligatorio' };
    }

    try {
      const { data, valid } = await this.cryptoService.decryptAndVerify(encryptedText);
      return { decryptedText: data, signatureValid: valid };
    } catch (error) {
      return { error: 'No se pudo descifrar la licencia. Puede estar alterada o dañada.' };
    }
  }
}
