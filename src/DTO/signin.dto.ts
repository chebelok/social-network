import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class SigninDTO {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @ApiProperty({
    description: 'User password',
    type: String
  })
  password: string;

  @IsEmail()
  @ApiProperty({
    description: 'User email',
    type: String
  })
  email: string;
}
