import { Module } from '@nestjs/common';
import { CryptoService } from './services/crypto.service';
import { CryptoController } from './crypto.controller';
import { KeyManagerService } from './services/key-manager.service';

@Module({
  controllers: [CryptoController],
  providers: [CryptoService, KeyManagerService],
})
export class CryptoModule {}
