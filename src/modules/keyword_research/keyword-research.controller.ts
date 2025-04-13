import { Body, Controller, Headers, Post } from '@nestjs/common';
import { KeywordResearchService } from './keyword-research.service';
import { KeywordCompetitionDto } from './dtos';
import { X_API_KEY, X_TRACE_ID } from '@app/common';

@Controller('v1/keyword-research')
export class KeywordResearchController {
  constructor(
    private readonly _keywordResearchService: KeywordResearchService,
  ) {}

  @Post('keyword-competition')
  async checkKeywordCompetition(
    @Body() dto: KeywordCompetitionDto,
    @Headers(X_TRACE_ID) traceId: string,
    @Headers(X_API_KEY) apiKey: string,
  ) {
    console.log('X-TRACE-ID:', traceId);
    return this._keywordResearchService.checkKeywordCompetition(dto, apiKey);
  }
}
