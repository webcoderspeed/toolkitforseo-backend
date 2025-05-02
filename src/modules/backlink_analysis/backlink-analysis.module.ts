import { Module } from '@nestjs/common';
import { BacklinkAnalysisController } from './backlink-analysis.controller';
import { BacklinkAnalysisService } from './backlink-analysis.service';

@Module({
  controllers: [BacklinkAnalysisController],
  providers: [BacklinkAnalysisService],
  exports: [BacklinkAnalysisService],
})
export class BacklinkAnalysisModule {}
