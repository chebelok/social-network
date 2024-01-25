import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';
import { User } from '../entities/user.entity';
import { Article } from '../entities/article.entity';
import { ArticleCategory } from '../entities/articleCategory.entity';

export class ArticleDTO {
  @ApiProperty({
    description: 'The title of the article',
    type: String,
    minLength: 2,
    maxLength: 255
  })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'The category of the article',
    type: String,
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  articleCategory: ArticleCategory;

  @ApiProperty({
    description: 'Publish date of the article',
    type: Date
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The content of the article',
    type: String
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The image path of the article',
    type: String
  })
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'The author of the article',
    type: Number
  })
  authorId: number;
}