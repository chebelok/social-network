import { IsString, IsOptional, IsEmail } from 'class-validator';

export class EmailOptionsData {
  @IsString()
  @IsEmail()
  to: string;

  @IsString()
  @IsOptional()
  message?: string;
}