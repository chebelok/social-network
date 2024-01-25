import { Body, Controller, Injectable, Param, Post, Res } from '@nestjs/common';
import { ArticleService } from '../services/article.service';
import { UserService } from '../services/user.service';
import { CommentService } from '../services/comment.service';
import { CommentDTO } from '../DTO/comment.dto';

@Controller()
export class CommentController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
    private readonly commentService: CommentService
  ) {}

  @Post('/comment')
  async addComment(
    @Body() commentData: CommentDTO,
    @Res() res
  ): Promise<void> {
    try {
      const article = await this.articleService.getArticleById(commentData.articleId as number);
      const author = await this.userService.getUserById(commentData.authorId as number);

      const comment = await this.commentService.createComment({
        title: commentData.title,
        content: commentData.content,
        articleId: article,
        authorId: author
      });

      res.status(200).send(comment);
    } catch (error) {
      res.status(500).send({ status: 'Server error', message: error.message });
    }
  }
}
