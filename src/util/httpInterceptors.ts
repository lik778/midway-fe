import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { apiSecret } from 'src/constant';
import { RequestService } from 'src/services/request.service';
import { LogService } from 'src/services/log.service'

@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        private readonly requestService: RequestService,
        private readonly configService: ConfigService
    ) {}
    async canActivate(context: ExecutionContext): Promise<any> {
        const req = context.switchToHttp().getRequest();
        const ip = '172.30.2.14';
        const url = `${req.url}`
        new LogService().errorLog(`headers:${req.headers}`)
        const params = {
            ip:  ip,
            jumpUrl: url
        }
        const res = context.switchToHttp().getResponse();
        const host = this.configService.get('services.midway-service.host');
        const data = await this.requestService.post(`${host}/api/midway/internal/waf/analytics`, params, { 'content-type': 'application/json','x-api-secret': apiSecret })
        const { code, data: { captchaHtml, bot }} = data
        console.log('datadata', data)
            if(bot){
                res.setHeader('Content-Type', 'text/html');
                res.send(captchaHtml);
                // res.render('verifySlide', captchaHtml)
            }else{
                return true
            }
    }
}
