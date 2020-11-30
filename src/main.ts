import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validate.pipe';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import pugFilters from './view-helpers'
import * as pug from 'pug'
/**
 * 创建应用实例
 * 用来启动http服务器，它允许应用程序等待入站http请求
 */
async function bootstrap() {
  // 默认情况下使用@nestjs/plateform-express 包。
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', 'dist/public'), {
    prefix: '/assets'
  });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  pug.filters = pugFilters
  app.setViewEngine('pug');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(7001);
}

bootstrap();
