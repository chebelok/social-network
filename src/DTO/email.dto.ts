import { ApiProperty } from '@nestjs/swagger';
import { IsEmail} from 'class-validator';

export class EmailDTO {
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    type: String
  })
  email: string;
}