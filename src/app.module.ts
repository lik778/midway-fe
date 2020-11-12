import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { SiteController } from './controllers/site.controller';
import { AppService } from './services/app.service';

@Module({
  imports: [],
  controllers: [AppController, SiteController],
  providers: [AppService],
})
export class AppModule {}
