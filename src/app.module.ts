import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CryptoModule } from './crypto/crypto.module';
import { KeyManagerService } from './crypto/services/key-manager.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CryptoModule
  ],
  controllers: [AppController],
  providers: [AppService, KeyManagerService],
})
export class AppModule { }
