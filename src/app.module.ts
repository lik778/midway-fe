import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { SiteController } from './controllers/site.controller';
import { ManagementController } from './controllers/management.controller';
import { MidwayApiService } from './services/midway-api.services';
import { RequestService } from './services/request.services';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [config]
  })],
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
