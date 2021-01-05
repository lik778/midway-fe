import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validate.pipe';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import pugFilters, { setPugViewEngineHeplers } from './view-helpers'
import { PORT } from './constant';
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
  // 处理关于渲染引擎问题
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');
  setPugViewEngineHeplers(pugFilters);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(PORT);
}

bootstrap();
