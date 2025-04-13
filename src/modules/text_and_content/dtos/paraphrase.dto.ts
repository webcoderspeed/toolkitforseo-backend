import { ALL_PARAPHRASED_MODE } from '@app/common';
import {
  AIVendorPayload,
  AIVendorType,
  IParaphrasedModeType,
} from '@app/common/types';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ParaphraseSettingsDto {
  @IsEnum(ALL_PARAPHRASED_MODE)
  @IsNotEmpty()
  mode?: IParaphrasedModeType = 'Standard';

  @IsOptional()
  @IsNumber()
  strength?: number = 50;
}

export class ParaphraseDto {
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
  @Type(() => ParaphraseSettingsDto)
  settings?: ParaphraseSettingsDto;
}
