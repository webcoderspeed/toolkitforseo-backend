import { Controller, Post, Body, Headers } from '@nestjs/common';
import { TextAndContentService } from './text_and_content.service';
import { ParaphraseDto, PlagiarismCheckerDto } from './dtos';
import { X_API_KEY, X_TRACE_ID } from '@app/common';

@Controller('v1/text-and-content')
export class TextAndContentController {
  constructor(private readonly textAndContentService: TextAndContentService) {}

  @Post('plagiarism-check')
  async checkPlagiarism(
    @Body() dto: PlagiarismCheckerDto,
    @Headers(X_TRACE_ID) traceId: string,
    @Headers(X_API_KEY) apiKey: string,
  ) {
    console.log('X-TRACE-ID:', traceId);
    return this.textAndContentService.checkPlagiarism(dto, apiKey);
  }

  @Post('paraphrase')
  async paraphraseText(
    @Body() dto: ParaphraseDto,
    @Headers(X_TRACE_ID) traceId: string,
    @Headers(X_API_KEY) apiKey: string,
  ) {
    console.log('X-TRACE-ID:', traceId);
    return this.textAndContentService.paraphraseText(dto, apiKey);
  }

  @Post('grammar-check')
  async checkGrammar(
    @Body() dto: ParaphraseDto,
    @Headers(X_TRACE_ID) traceId: string,
    @Headers(X_API_KEY) apiKey: string,
  ) {
    console.log('X-TRACE-ID:', traceId);
    return this.textAndContentService.checkGrammar(dto, apiKey);
  }
}
