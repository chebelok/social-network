import { Body, Controller, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ArticleService } from "../services/article.service";
import { MulterError, diskStorage } from "multer";
import path = require("path");

import { UserService } from "../services/user.service";
import { AdminGuard } from "../guards/admin.guard";
import { ModerationGuard } from "../guards/moderation.guard";
import { ModerationStatus } from "../enums/moderation.enum";
import { QueryOptionsDTO } from "../DTO/queryOptions.dto";
import { AuthGuard } from "../guards/auth.guard";
import { User } from "../entities/user.entity";
import { ArticleCategoryService } from "../services/articleCategory.servise";

@Controller()
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
    private readonly articleCategoryService: ArticleCategoryService
  ) {}

  @Get('/articles')
  async getArticlesByCategory(@Body() body: { categoryId?: number }, @Query() options: QueryOptionsDTO, @Res() res) {
    try {
      const { limit, offset, search } = options;
      const articles = await this.articleService.filterArticlesByCategory(body.categoryId, search, limit, offset);
      res.status(200).send({ articles });
    } catch (error) {
      res.status(500).send({ status: 'Server error', message: error.message });
    }
  }

  @Get('/article')
  async getArticles(@Query() options: QueryOptionsDTO, @Res() res) {
    try {
      const isAdmin = false;
      const { search, limit, offset } = options;
      const articles = await this.articleService.filterArticles(search, limit, offset, isAdmin);
      res.status(200).send({ articles });
    } catch (error) {
      res.status(500).send({ status: 'Server error', message: error.message });
    }
  }

  @Get('/all-articles')
  @UseGuards(AdminGuard)
  async getArticlesBySearch(@Query() options: QueryOptionsDTO, @Res() res) {
    try {
      const isAdmin = true;
      const { search, limit, offset, status } = options;
      const articles = await this.articleService.filterArticles(search, limit, offset, isAdmin, status);
      res.status(200).send({ articles });
    } catch (error) {
      res.status(500).send({ status: 'Server error', message: error.message });
    }
  }

  @Get('/article/:id')
  async getArticleById(@Param('id') id: number, @Res() res) {
    try {
      const article = await this.articleService.getArticleById(id);
      res.status(200).send({ article });
    } catch (error) {
      res.status(500).send({ status: 'Server error', message: error.message });
    }
  }
  
  @Post('/article')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(jpg|HEIC|png|jpeg)$/))
        cb(null, true);
      else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    },
    storage: diskStorage({
      destination: './uploads/articles',
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '');
        const extension: string = path.parse(file.originalname).ext;

        cb(null, `${filename}${extension}`);
      }
    })
  }))
  async createArticle(@Body() articleData, @Res() res, @Req() req, @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: +process.env.MAX_FILE_SIZE })
      ]
    })
  ) file): Promise<void> {
    try {
      const { categoryId } = articleData;
      const token = req.headers.authorization.split(' ')[1];
      const userId = await this.userService.getCurrentUser(token).then(user => user.result.id);
      const articleCategory = await this.articleCategoryService.getCategoryById(categoryId)
      if(!userId) {
        res.status(500).send({status: 'Error', message: 'User not found'});
      } else {
        const article = await this.articleService.createArticle({...articleData, image: file.path, authorId: userId, articleCategory});
        res.status(200).send({status: 'Success', article});
      }
    } catch (error) {
      res.status(500).send({ status: 'Server error', message: error.message });
    }
  }

  @Put('/article/moderate')
  @UseGuards(AdminGuard, ModerationGuard)
  async approveArticle(@Body() moderationOptions: { articleId: number, status: ModerationStatus}, @Res() res): Promise<void> {
    try {
      const { articleId, status } = moderationOptions;
      const article = await this.articleService.moderateArticle(articleId, status);
      res.status(200).send(article);
    } catch (error) {
      res.status(500).send({ status: 'Server error', message: error.message });
    }
  }
}
