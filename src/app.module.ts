import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TextAndContentModule } from './modules/text_and_content/text_and_content.module';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard, TraceIdGuard } from '@app/common/guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TextAndContentModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: TraceIdGuard,
    },
  ],
})
export class AppModule {}
