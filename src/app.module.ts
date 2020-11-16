import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SiteController } from './controllers/site.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [SiteController],
  providers: [],
})
export class AppModule {}
