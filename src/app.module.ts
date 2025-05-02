import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard, TraceIdGuard } from '@app/common/guards';
import { AIVendorFactory } from '@app/common/factories';
import {
  BacklinkAnalysisModule,
  KeywordResearchModule,
  TextAndContentModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TextAndContentModule,
    KeywordResearchModule,
    BacklinkAnalysisModule,
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
