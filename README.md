<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Descripción

PoC para Cifrado y firma de datos con TweetNaCl

## Objetivo

El objetivo de esta Prueba de Concepto (PoC) es evaluar la viabilidad del uso de la biblioteca TweetNaCl para garantizar la confidencialidad, integridad y autenticidad de los datos mediante un proceso que incluye cifrado, firmado, descifrado y validación de firma

## Arquitectura general de la solución
### Descripción general
La PoC de cifrado, firmado, descifrado y validación de firma se implementa como una aplicación monolítica desarrollada con NestJS en su versión 11.0.1. El sistema está construido siguiendo principios de modularidad y separación de responsabilidades, lo que facilita la escalabilidad y mantenibilidad del código.
Para las operaciones criptográficas, la solución utiliza la librería TweetNaCl (v1.0.3) junto con TweetNaCl-Util (v0.15.1), lo que permite realizar cifrado de datos, generación y verificación de firmas digitales de manera segura y eficiente.

### Componentes principales
El diseño del sistema se basa en dos interfaces clave y sus respectivas implementaciones:
1. ICryptoService: Define las operaciones criptográficas principales, incluyendo cifrado, descifrado, firma y validación de firma.
    * CryptoService: Implementa ICryptoService, proporcionando la lógica para ejecutar las operaciones criptográficas de manera segura y eficiente.
2. IKeyManagerService: Maneja la recuperación de claves criptográficas para el uso de las funciones de cifrado, firma, descifrado y validación de firma.
    * KeyManagerService: Implementa IKeyManagerService, gestionando las claves de cifrado y firma, asegurando su correcta distribución y uso dentro del sistema.

### Flujo del proceso de firma y cifrado
1. El sistema central firma los datos con Ed25519 (Llave privada para firmar).
2. Genera una clave secreta aleatoria para cifrado simétrico.
3. Se genera un nonce aleatorio (number used once).
4. Los datos + firma se cifran con XChaCha20-Poly1305 usando el nonce y la clave secreta aleatoria.
5. La clave secreta se cifra con la llave pública para cifrar (llave pública para cifrado).
6. Se concatena (clave secreta aleatoria cifrada + nonce + datos cifrados) en un solo bloque Base64.

### Flujo del proceso de descifrado y validación de firma

1. Convierte datos de Base64 a Uint8Array.
2. Extraer partes: Clave secreta aleatoria cifrada, nonce y datos cifrados.
3. Descifrar la clave secreta cifrada con la llave privada para cifrado (llave privada para
cifrado).
4. Descifrar los datos firmados, para ello usa la clave secreta descifrada y el nonce.
5. Valida firma utilizando la llave pública para firmar (llave pública para firmar)

### Endpoints del servicio
1. Cifrado y Firma
    * Endpoint: POST /encrypt
    * Descripción: Firma digitalmente los datos en texto plano y los cifra para su almacenamiento o transmisión segura.
    * Parámetro de entrada: JSON con la siguiente estructura
        {
            "text": "Datos en texto plano"
        }
    * Salida: Datos firmados y cifradps en formato Base64.

2. Descifrado y Validación de Firma
    * Endpoint: POST /decrypt
    * Descripción: Descifra los datos cifrada previamente y verifica la integridad y autenticidad de la firma digital.
    * Parámetro de entrada: JSON con la siguiente estructura
		  {
    		"encryptedText": "Datos en formato Base64"
      }
    * Salida: Datos descifrados y resultado de la validación de la firma.

## Conclusiones
### Flexibilidad y Modularidad
TweetNaCl ofrece una implementación minimalista, lo que permite una integración modular en distintas partes de la aplicación sin dependencias innecesarias. Al separar las responsabilidades en ICryptoService y IKeyManagerService, la solución mantiene una arquitectura flexible que permite sustituir o extender la funcionalidad criptográfica sin afectar otras capas del sistema.
### Integración Sencilla
A diferencia de otras librerías más complejas, TweetNaCl es fácil de integrar en proyectos Node.js, ya que es una implementación pura en JavaScript y no requiere compilaciones adicionales. Esto simplifica el proceso de instalación y reduce posibles problemas de compatibilidad con entornos de ejecución o despliegue.
### Seguridad
TweetNaCl está diseñado para ser seguro por defecto, evitando configuraciones incorrectas que puedan comprometer la integridad del cifrado y la firma digital. Implementa algoritmos criptográficos modernos y eficientes como Ed25519 para firmas digitales y XChaCha20-Poly1305 para cifrado autenticado, lo que garantiza un alto nivel de protección contra ataques criptográficos.
### Costo-Beneficio
Al ser una librería de código abierto, TweetNaCl no implica costos de licencia ni suscripciones. Su rendimiento es adecuado para muchas aplicaciones sin necesidad de optimizaciones adicionales, lo que reduce la carga operativa y los costos de desarrollo. Sin embargo, en escenarios de alto rendimiento, puede ser necesario evaluar alternativas más optimizadas como Libsodium o sodium-native.
### Soporte y Comunidad Activa
TweetNaCl es ampliamente adoptado en la comunidad de seguridad y cuenta con soporte en múltiples plataformas, incluyendo implementaciones en C, JavaScript y otros lenguajes. Aunque su desarrollo no es tan activo como el de Libsodium, sigue siendo una opción confiable con documentación clara y recursos suficientes para su implementación en proyectos de producción.

## Instalaci+on de dependencias del proyecto

```bash
$ npm install
```

## Compilación y ejecución del proyecto

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```