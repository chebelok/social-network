import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { IsString, IsOptional } from 'class-validator';

export class CurrentUserDTO {
  @IsString()
  @ApiProperty({
    description: 'Result of registration',
    type: String
  })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Optional error message',
    type: String,
    nullable: true
  })
  message?: string;
  
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Current user',
    type: String,
    nullable: true
  })
  result?: User;
}