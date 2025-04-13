import { ApiProperty } from '@nestjs/swagger';

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
