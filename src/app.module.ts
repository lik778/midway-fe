import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TemplateController } from './controllers/template.controller';
import { AppService } from './services/app.service';

@Module({
  imports: [],
  controllers: [AppController, TemplateController],
  providers: [AppService],
})
export class AppModule {}
