import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { apiSecret } from 'src/constant';
import { RequestService } from 'src/services/request.service';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        private readonly requestService: RequestService,
        private readonly configService: ConfigService
    ) {}
    async canActivate(context: ExecutionContext): Promise<any> {
        const params = {
            ip:  context.switchToHttp().getRequest().headers.host,
            jumpUrl: 'https://www.baidu.com'
        }
        const host = this.configService.get('services.midway-service.host');
        const data = await this.requestService.post(`${host}/api/midway/internal/waf/analytics`, params, { 'content-type': 'application/json','x-api-secret': apiSecret })
        const { code, data: { captchaHtml, bot }} = data
        if(code === 0){
            if(bot){

            }
        }
        return true
    }
}
