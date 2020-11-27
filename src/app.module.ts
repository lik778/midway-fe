import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { SiteController } from './controllers/site.controller';
import { ManagementController } from './controllers/management.controller';
import { MidwayService } from './services/midway.service';
import { RequestService } from './services/request.service';
import { AppController } from './controllers/app.controller';

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
    SiteController
  ],
  providers: [
    RequestService,
    MidwayService
  ],
})
export class AppModule {}
