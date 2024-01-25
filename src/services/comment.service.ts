import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Article } from "../entities/article.entity";
import { Comment } from "../entities/comment.entity";
import { User } from "../entities/user.entity";
import { CommentDTO } from "../DTO/comment.dto";
import { log } from '../utils/logger.util';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>
  ) {}

  async createComment(commentData: CommentDTO) {
    try {
      const  { title, content, articleId, authorId } = commentData;
      if(!authorId) return {status: 'Error', message: 'Author is required'};
      if(!articleId || (articleId as Article).status !== 'APPROVED') return {status: 'Error', message: 'Article is not found or not approved'};

      const comment = new Comment();
      comment.title = title;
      comment.publishedAt = new Date();
      comment.content = content;
      comment.article = articleId as Article;
      comment.author = authorId as User;

      await this.commentRepository.save(comment);
      return {status: 'Success', message: 'Comment created successfully'};

    } catch (error) {
      log(error);
    }
  }


}