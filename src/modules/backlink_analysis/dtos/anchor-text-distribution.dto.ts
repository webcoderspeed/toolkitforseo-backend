import { AIVendorPayload, AIVendorType } from '@app/common/types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AnchorTextDistributionDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  @IsString()
  model?: AIVendorPayload['model'];

  @IsOptional()
  @IsString()
  vendor?: AIVendorType = 'gemini';
}
