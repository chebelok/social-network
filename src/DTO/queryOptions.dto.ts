import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, MinLength, MaxLength, IsString } from 'class-validator';
import { ModerationStatus } from '../enums/moderation.enum';

export class QueryOptionsDTO {

  @IsNumber()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty({
    description: 'Number of items to return',
    type: Number,
    nullable: true
  })
  limit?: number;

  @IsNumber()
  @ApiProperty({
    description: 'Number of items to skip',
    type: Number,
    nullable: true
  })
  offset?: number;

  @IsString()
  @ApiProperty({
    description: 'Value to filter by',
    type: String,
    nullable: true
  })
  search?: string;

  @ApiProperty({
    description: 'Moderation status to filter by',
    type: String,
    nullable: true
  })
  status?: ModerationStatus;
}