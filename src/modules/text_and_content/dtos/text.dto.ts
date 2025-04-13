import { ALL_PLAGIARISM_CHECKER_DETECTION_MODEL } from '@app/common';
import {
  AIVendorPayload,
  AIVendorType,
  IPlagiarismCheckerDetectionModelType,
} from '@app/common/types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  ValidateNested,
} from 'class-validator';

export class PlagiarismCheckerSettingsDto {
  @IsEnum(ALL_PLAGIARISM_CHECKER_DETECTION_MODEL)
  @IsNotEmpty()
  detection_model?: IPlagiarismCheckerDetectionModelType = 'Standard';
}

export class PlagiarismCheckerDto {
  @ApiProperty({
    description: 'The text to be processed',
    example: 'This is a sample text for processing.',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsString()
  model?: AIVendorPayload['model'];

  @IsOptional()
  @IsString()
  vendor?: AIVendorType = 'gemini';

  @IsOptional()
  @ValidateNested()
  @Type(() => PlagiarismCheckerSettingsDto)
  settings?: PlagiarismCheckerSettingsDto;
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
