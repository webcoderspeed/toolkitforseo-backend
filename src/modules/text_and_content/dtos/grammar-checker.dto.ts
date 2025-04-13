import { AIVendorPayload, AIVendorType } from '@app/common/types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GrammarCheckerDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsString()
  model?: AIVendorPayload['model'];

  @IsOptional()
  @IsString()
  vendor?: AIVendorType = 'gemini';
}
