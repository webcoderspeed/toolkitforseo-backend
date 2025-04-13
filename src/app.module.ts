import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TextAndContentModule } from './modules/text_and_content';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard, TraceIdGuard } from '@app/common/guards';
import { AIVendorFactory } from '@app/common/factories';
import { KeywordResearchModule } from './modules/keyword_research/keyword-research.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TextAndContentModule,
    KeywordResearchModule,
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
    AIVendorFactory,
  ],
})
export class AppModule {}
