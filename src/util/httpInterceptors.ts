import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { apiSecret } from 'src/constant';
import { RequestService } from 'src/services/request.service';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        private readonly requestService: RequestService,
        private readonly configService: ConfigService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<any> {
        const req = context.switchToHttp().getRequest();
        const ip = req.headers['x-forwarded-for'];
        const url = `${req.url}`
        const params = {
            ip: ip,
            jumpUrl: url
        }
        const res = context.switchToHttp().getResponse();
        const host = this.configService.get('services.midway-service.host');
        try {
            const { code, data: { captchaHtml, bot } } = await this.requestService.post(
                `${host}/api/midway/internal/waf/analytics`,
                params,
                {
                    'content-type': 'application/json',
                    'x-api-secret': apiSecret
                },
                { timeout: 2000 }
            )
            if (code === 200) {
                if (bot) {
                    res.setHeader('Content-Type', 'text/html');
                    res.send(captchaHtml);
                    // res.render('verifySlide', captchaHtml)
                } else {
                    return true
                }
            } else {
                return true
            }
        } catch (error) {
            console.log(error)
            return true
        } finally {
            return true
        }
    }
}
