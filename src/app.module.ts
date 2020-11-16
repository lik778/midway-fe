import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SiteController } from './controllers/site.controller';
import config from './config';
import { MidwayApiService } from './services/midway-api.services';
import { RequestService } from './services/request.services';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [config]
  })],
  controllers: [SiteController],
  providers: [
    RequestService,
    MidwayApiService
  ],
})
export class AppModule {}
