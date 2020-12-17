import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { ManagementController } from './controllers/management.controller';
import { MidwayService } from './services/midway.service';
import { RequestService } from './services/request.service';
import { AppController } from './controllers/app.controller';
import { HaojingController } from './controllers/haojing.controller';
import { HaojingService } from './services/haojing.service';
import { SitemapController } from './controllers/sitemap.controller';
import { SitemapService } from './services/sitemap.service';
import { LogService } from './services/log.service';
import { B2bSiteController } from './controllers/site/b2b-site.controller';
import { FuwuSiteController } from './controllers/site/fuwu-site.controller';

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
    B2bSiteController,
    FuwuSiteController,
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
