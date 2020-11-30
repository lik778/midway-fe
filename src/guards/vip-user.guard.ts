import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class VipUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // todo: 用户能否进入
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    // res.redirect('http://wulei.baixing.com')
    return true;
  }
}
