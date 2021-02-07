import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { ManagementController } from './controllers/management.controller';
import { SiteService } from './services/site.service';
import { RequestService } from './services/request.service';
import { AppController } from './controllers/app.controller';
import { AdminController } from './controllers/admin.controller';
import { HaojingController } from './controllers/haojing.controller';
import { HaojingService } from './services/haojing.service';
import { SitemapController } from './controllers/sitemap.controller';
import { SitemapService } from './services/sitemap.service';
import { LogService } from './services/log.service';
import { B2bSiteController } from './controllers/site/b2b-site.controller';
import { FuwuSiteController } from './controllers/site/fuwu-site.controller';
import { TrackerService } from './services/tracker.service';
import { TrackerController } from './controllers/tracker.controller';
import { ManagementService } from './services/management.service';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './services/report.service';

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
    AdminController,
    ManagementController,
    SitemapController,
    B2bSiteController,
    FuwuSiteController,
    HaojingController,
    TrackerController,
    ReportController
  ],
  providers: [
    LogService,
    RequestService,
    ManagementService,
    SiteService,
    HaojingService,
    SitemapService,
    TrackerService,
    ReportService
  ],
})
export class AppModule {}
