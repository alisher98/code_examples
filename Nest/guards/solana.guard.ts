import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as bs58 from 'bs58';
import * as nacl from 'tweetnacl';
import { Buffer } from 'buffer';
@Injectable()
export class SolanaGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const credentials = request.headers?.authorization?.split(' ')[1];
    const [publicKey, signature] = Buffer.from(credentials, 'base64')
      .toString()
      .split(':');
    const nonce = request.cookies['auth-nonce'];
    const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce}`;
    const messageBytes = new TextEncoder().encode(message);
    const publicKeyBytes = bs58.decode(publicKey);
    const signatureBytes = bs58.decode(signature);
    const result = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes,
    );
    console.log(result);
    if (!result) {
      return false;
    }
    request.user = {
      name: publicKey,
    };
    return true;
  }
}
