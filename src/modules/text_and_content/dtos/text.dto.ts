import { GeminiAskPayload } from '@app/common/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class TextInputDto {
  @ApiProperty({
    description: 'The text to be processed',
    example: 'This is a sample text for processing.',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsString()
  model?: GeminiAskPayload['model'];

  @IsOptional()
  @IsString()
  prompt?: string;
}

export class PlagiarismResponseDto {
  @ApiProperty()
  originalText: string;

  @ApiProperty()
  plagiarismScore: number;

  @ApiProperty({ type: [String] })
  matches: string[];
}

export class ParaphraseResponseDto {
  @ApiProperty()
  originalText: string;

  @ApiProperty()
  paraphrasedText: string;
}

export class AIContentResponseDto {
  @ApiProperty()
  originalText: string;

  @ApiProperty()
  aiProbability: number;

  @ApiProperty()
  isAIGenerated: boolean;
}

export class ProofreadResponseDto {
  @ApiProperty()
  originalText: string;

  @ApiProperty({ type: [String] })
  corrections: string[];

  @ApiProperty({ type: [String] })
  suggestions: string[];
}

export class RewriteResponseDto {
  @ApiProperty()
  originalText: string;

  @ApiProperty()
  rewrittenText: string;
}

export class RephraseResponseDto {
  @ApiProperty()
  originalText: string;

  @ApiProperty()
  rephrasedText: string;
}

export class SummarizeResponseDto {
  @ApiProperty()
  originalText: string;

  @ApiProperty()
  summary: string;
}

export class GrammarCheckResponseDto {
  @ApiProperty()
  originalText: string;

  @ApiProperty({ type: [String] })
  errors: string[];

  @ApiProperty({ type: [String] })
  suggestions: string[];
}
