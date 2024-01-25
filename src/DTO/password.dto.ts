import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

export class PasswordDTO {
  @MinLength(8)
  @MaxLength(20)
  @ApiProperty({
    description: 'New password',
    type: String
  })
  password: string;

  @ApiProperty({
    description: 'Unique token',
    type: String
  })
  token: string;
}