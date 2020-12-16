import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { SiteController } from './controllers/site.controller';
import { ManagementController } from './controllers/management.controller';
import { MidwayService } from './services/midway.service';
import { RequestService } from './services/request.service';
import { AppController } from './controllers/app.controller';
import { HaojingController } from './controllers/haojing.controller';
import { HaojingService } from './services/haojing.service';
import { SitemapController } from './controllers/sitemap.controller';
import { SitemapService } from './services/sitemap.service';
import { LogService } from './services/log.service';

/**
 * 应用程序根模块
 */
@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    load: [config]
  }), HttpModule ],
  controllers: [
    AppController,
    ManagementController,
    SitemapController,
    SiteController,
    HaojingController
  ],
  providers: [
    LogService,
    RequestService,
    MidwayService,
    HaojingService,
    SitemapService
  ],
})
export class AppModule {}
