import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
// 引入的service
import { SiteService } from './services/site.service';
import { RequestService } from './services/request.service';
import { SitemapService } from './services/sitemap.service';
import { LogService } from './services/log.service';
import { TrackerService } from './services/tracker.service';
import { ManagementService } from './services/management.service';
import { ReportService } from './services/report.service';
import { ZhidaoService } from './services/zhidao.service';
import { SemApiService } from './services/sem.service'
// 引入controller
import { ManagementController } from './controllers/management.controller';
import { AppController } from './controllers/app.controller';
import { AdminController } from './controllers/admin.controller';
import { UpyunController } from './controllers/upyun.controller';
import { SitemapController } from './controllers/sitemap.controller';
import { B2bSiteController } from './controllers/site/b2b-site.controller';
import { FuwuSiteController } from './controllers/site/fuwu-site.controller';
import { TrackerController } from './controllers/tracker.controller';
import { ReportController } from './controllers/report.controller';
import { ZhidaoController } from './controllers/zhidao.controller';
import { SiteCommonController } from './controllers/site/site-common.controller';
import { SemController } from './controllers/sem.controller'

/**
 * 应用程序根模块
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }), HttpModule],
  controllers: [
    AppController,
    AdminController,
    ManagementController,
    SitemapController,
    SiteCommonController,
    B2bSiteController,
    FuwuSiteController,
    UpyunController,
    TrackerController,
    ReportController,
    ZhidaoController,
    SemController
  ],
  providers: [
    LogService,
    RequestService,
    ManagementService,
    SiteService,
    SitemapService,
    TrackerService,
    ReportService,
    ZhidaoService,
    SemApiService
  ],
})
export class AppModule { }
