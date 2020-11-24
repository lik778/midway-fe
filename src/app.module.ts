import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { SiteController } from './controllers/site.controller';
import { ManagementController } from './controllers/management.controller';
import { MidwayApiService } from './services/midway-api.service';
import { RequestService } from './services/request.service';

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
    SiteController,
    ManagementController
  ],
  providers: [
    RequestService,
    MidwayApiService
  ],
})
export class AppModule {}
