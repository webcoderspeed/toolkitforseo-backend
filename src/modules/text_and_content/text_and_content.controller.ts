import { Controller, Post, Body, HttpStatus, Headers } from '@nestjs/common';
import { TextAndContentService } from './text_and_content.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  TextInputDto,
  PlagiarismResponseDto,
  ParaphraseResponseDto,
  AIContentResponseDto,
  ProofreadResponseDto,
  RewriteResponseDto,
  RephraseResponseDto,
  SummarizeResponseDto,
  GrammarCheckResponseDto,
} from './dtos';
import { X_API_KEY, X_TRACE_ID } from '@app/common';

@ApiTags('Text and Content')
@Controller('v1/text-and-content')
export class TextAndContentController {
  constructor(private readonly textAndContentService: TextAndContentService) {}

  @Post('plagiarism-check')
  @ApiResponse({ status: HttpStatus.OK, type: PlagiarismResponseDto })
  async checkPlagiarism(
    @Body() dto: TextInputDto,
    @Headers(X_TRACE_ID) traceId: string,
    @Headers(X_API_KEY) apiKey: string,
  ) {
    console.log('X-TRACE-ID:', traceId);
    return this.textAndContentService.checkPlagiarism(dto, apiKey);
  }

  @Post('paraphrase')
  @ApiResponse({ status: HttpStatus.OK, type: ParaphraseResponseDto })
  async paraphraseText(@Body() body: TextInputDto) {
    return this.textAndContentService.paraphraseText(body.text);
  }

  @Post('ai-content-detect')
  @ApiResponse({ status: HttpStatus.OK, type: AIContentResponseDto })
  async detectAIContent(@Body() body: TextInputDto) {
    return this.textAndContentService.detectAIContent(body.text);
  }

  @Post('proofread')
  @ApiResponse({ status: HttpStatus.OK, type: ProofreadResponseDto })
  async proofreadText(@Body() body: TextInputDto) {
    return this.textAndContentService.proofreadText(body.text);
  }

  @Post('rewrite')
  @ApiResponse({ status: HttpStatus.OK, type: RewriteResponseDto })
  async rewriteArticle(
    @Body() dto: TextInputDto,
    @Headers(X_TRACE_ID) traceId: string,
    @Headers(X_API_KEY) apiKey: string,
  ) {
    console.log('X-TRACE-ID:', traceId);
    return this.textAndContentService.rewriteArticle(dto, apiKey);
  }

  @Post('rephrase-sentence')
  @ApiResponse({ status: HttpStatus.OK, type: RephraseResponseDto })
  async rephraseSentence(@Body() body: TextInputDto) {
    return this.textAndContentService.rephraseSentence(body.text);
  }

  @Post('summarize')
  @ApiResponse({ status: HttpStatus.OK, type: SummarizeResponseDto })
  async summarizeText(@Body() body: TextInputDto) {
    return this.textAndContentService.summarizeText(body.text);
  }

  @Post('grammar-check')
  @ApiResponse({ status: HttpStatus.OK, type: GrammarCheckResponseDto })
  async checkGrammar(@Body() body: TextInputDto) {
    return this.textAndContentService.checkGrammar(body.text);
  }
}
