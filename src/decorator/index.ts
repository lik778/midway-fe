import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userAgent = request.headers["user-agent"].toLowerCase();
    switch (data) {
      case 'isWap':
        return /android|iphone|ipod|ipad|micromessenger/i.test(userAgent);
        break;
      case 'isAndroid':
        return /android/i.test(userAgent);
        break;
      case 'isIOS':
        return /iphone|ipod|ipad/i.test(userAgent);
        break;
      default:
        break;
    }
  }
);
