import { Module } from '@nestjs/common';
import { KeywordResearchController } from './keyword-research.controller';
import { KeywordResearchService } from './keyword-research.service';

@Module({
  controllers: [KeywordResearchController],
  exports: [KeywordResearchService],
  providers: [KeywordResearchService],
})
export class KeywordResearchModule {}
