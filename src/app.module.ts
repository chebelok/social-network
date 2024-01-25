import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { ArticleController } from './controllers/article.controller';
import { CommentController } from './controllers/comment.controller';

import { UserService } from './services/user.service';
import { EmailService } from './services/email.service';
import { ArticleService } from './services/article.service';
import { CommentService } from './services/comment.service';

import { User } from './entities/user.entity';
import { Article } from './entities/article.entity';
import { Comment } from './entities/comment.entity';

import { StaticFilesMiddleware } from './middlewares/static-files.middleware';

import * as dotenv from 'dotenv';
import { ArticleCategory } from './entities/articleCategory.entity';
import { ArticleCategoryController } from './controllers/articleCategory.controller';
import { ArticleCategoryService } from './services/articleCategory.servise';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Article, Comment, ArticleCategory]
    }), 
    TypeOrmModule.forFeature([User, Article, Comment, ArticleCategory]),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        secure: false,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD
        }
      }
    }),
    MulterModule.register({
      dest: './uploads'
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    })
    
  ],
  controllers: [AuthController, UserController, ArticleController, CommentController, ArticleCategoryController],
  providers: [UserService, EmailService, ArticleService, CommentService, ArticleCategoryService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StaticFilesMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
