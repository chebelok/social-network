import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";
import { Article } from "../entities/article.entity";
import { User } from "../entities/user.entity";

export class CommentDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Comment title',
    type: String
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Comment content',
    type: String
  })
  content: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Article id',
    type: Number
  })
  articleId: number | Article;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Author id',
    type: Number
  })
  authorId: number | User;
}