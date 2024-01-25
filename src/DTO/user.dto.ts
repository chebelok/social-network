import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, MaxLength, IsNumber } from 'class-validator';

export class UserDTO {
  @IsNumber()
  @ApiProperty({
    description: 'User ID',
    type: String
  })
  id?: number;

  @IsString()
  @ApiProperty({
    description: 'User name',
    type: String
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: 'User email',
    type: String
  })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @ApiProperty({
    description: 'User password',
    type: String
  })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User birthdate',
    type: String,
    nullable: true
  })
  birthdate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User about',
    type: String,
    nullable: true
  })
  about?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User avatar',
    type: String,
    nullable: true
  })
  avatarPath?: string;
}
