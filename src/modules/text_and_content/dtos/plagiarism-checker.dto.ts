import { ALL_PLAGIARISM_CHECKER_DETECTION_MODEL } from '@app/common';
import {
  AIVendorPayload,
  AIVendorType,
  IPlagiarismCheckerDetectionModelType,
} from '@app/common/types';
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
