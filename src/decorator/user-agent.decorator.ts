import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DeviceType } from '../enums/base';

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userAgent = request.headers["user-agent"] && request.headers["user-agent"].toLowerCase();
    const isWap = /android|iphone|ipod|ipad|micromessenger/i.test(userAgent);
    switch (data) {
      case 'isWap':
        return isWap;
        break;
      case 'device':
        return isWap ? DeviceType.WAP : DeviceType.PC
        break;
      case 'isAndroid':
        return /android/i.test(userAgent);
        break;
      case 'isIOS':
        return /iphone|ipod|ipad/i.test(userAgent);
        break;
      default:
        return '';
        break;
    }
  }
);
