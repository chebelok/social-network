import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ModerationStatus } from '../enums/moderation.enum';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { ArticleCategory } from './articleCategory.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  createdAt: Date;
  
  @Column({ nullable: true })
  publishedAt?: Date;
  
  @Column({ 
    type: 'text',
    nullable: false 
  })
  content: string;
  
  @Column({ nullable: false })
  status: ModerationStatus;
  
  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => ArticleCategory, { cascade: true })
  category: ArticleCategory;

  @ManyToOne(() => User, user => user.articles)
  author: User;

  @OneToMany(() => Comment, comment => comment.article, { cascade: true })
  comments: Comment[];
}
