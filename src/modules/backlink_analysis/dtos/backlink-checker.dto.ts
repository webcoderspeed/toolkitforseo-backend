import { IsNotEmpty, IsString } from 'class-validator';

export class BacklinkCheckerDto {
  @IsString()
  @IsNotEmpty()
  url: string;
}
