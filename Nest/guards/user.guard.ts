import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { hasher, decrypt } from '../utils';
import { CacheManagerService } from '../modules/cache-manager/cache-manager.service';
import { AccountService } from '../modules/account/account.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly cacheService: CacheManagerService,
    private readonly accountService: AccountService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const requestHash = request.headers?.authorization?.split(' ')[1];
    if (!requestHash) {
      return false;
    }
    const { publicKey, timestamp, hash } = decrypt(requestHash);
    const generatedHash = hasher(publicKey, timestamp, false);
    if (hash !== generatedHash) {
      return false;
    }
    let accountId = this.cacheService.get(publicKey);
    if (!accountId) {
      const { id } = await this.accountService.getProfile(publicKey);
      accountId = id;
      this.cacheService.set(publicKey, id);
    }
    request.user = {
      id: accountId,
      wallet: publicKey,
    };
    return true;
  }
}
