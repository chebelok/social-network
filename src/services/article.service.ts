import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';

import { Article } from '../entities/article.entity';
import { User } from '../entities/user.entity';
import { ArticleDTO } from '../DTO/article.dto';
import { ModerationStatus } from '../enums/moderation.enum';
import { log } from '../utils/logger.util';
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async createArticle(articleData: ArticleDTO) {
    try {
      const { title, content, image, authorId, articleCategory } = articleData;
      const author = await this.userRepository.findOneBy({ id: authorId });
      if (!author) return { status: 'Error', message: 'Author is required' };

      const article = new Article();
      article.title = title;
      article.category = articleCategory;
      article.createdAt = new Date();
      article.content = content;
      article.status = ModerationStatus.pending;
      article.image = join(process.cwd(), image);
      article.author = author as User;

      await this.articleRepository.save(article);
      return { status: 'Success', message: 'Article created successfully' };
    } catch (error) {
      log(error);
    }
  }

  async moderateArticle(articleId: number, status: ModerationStatus) {
    try {
      const article = await this.articleRepository.findOneBy({ id: articleId });
      if (!article) return { status: 'Error', message: 'Article not found' };
      else {
        article.status = status;
        article.publishedAt = new Date();
        await this.articleRepository.save(article);
        return { status: 'Success', message: `Article ${status} successfully` };
      }
    } catch (error) {
      log(error);
    }
  }

  async getArticleById(id: number) {
    try {
      const article = await this.articleRepository.findOneBy({ id });
      return article;
    } catch (error) {
      log(error);
    }
  }

  async filterArticlesByCategory(
    categoryId: number,
    search: string,
    limit: number,
    offset: number
  ) {
    try {
      let articles: any = this.articleRepository
        .createQueryBuilder('article')
        .innerJoin('article.author', 'author')
        .innerJoin('article.category', 'category');

      articles = search
        ? articles.where(`
          category.id = :categoryId AND 
          status = 'APPROVED' AND
          (title iLIKE :search OR
          content iLIKE :search OR
          author.name iLIKE :search)
          `, { categoryId, search: `%${search}%` })
        : articles.where(`category.id = :categoryId AND status = 'APPROVED'`, { categoryId });

      return await articles.limit(limit).offset(offset).getMany();
    } catch (error) {
      log(error);
    }
  }

  async filterArticles(
    search: string,
    limit: number,
    offset: number,
    isAdmin?: boolean,
    status?: ModerationStatus
  ) {
    try {
      let articles: any = this.articleRepository
        .createQueryBuilder('article')
        .innerJoin('article.category', 'category')
        .innerJoin('article.author', 'author');

      if (search) {
        articles = await articles.where(
          `
          title iLIKE :search OR
          content iLIKE :search OR
          category.name iLIKE :search OR
          author.firstName iLIKE :search
          `,
          { search: `%${search}%` }
        );
      }
      if (isAdmin)
        articles = status
          ? articles.where('status = :status', { status })
          : articles;
      else articles = articles.where("status='APPROVED'");

      return await articles.limit(limit).offset(offset).getMany();
    } catch (error) {
      log(error);
    }
  }
}
