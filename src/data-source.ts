import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { join } from 'path';

import * as dotenv from 'dotenv';
import { Article } from './entities/article.entity';
import { Comment } from './entities/comment.entity';
import { ArticleCategory } from './entities/articleCategory.entity';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Article, Comment, ArticleCategory],
  migrations: [join(__dirname, '/migrations/*.{ts,js}')],
  migrationsRun: true,
  subscribers: []
});
