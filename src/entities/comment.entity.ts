import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Article } from './article.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ 
    type: 'text',
    nullable: false 
  })
  content: string;

  @Column({ nullable: false })
  publishedAt: Date;

  @ManyToOne(() => User, user => user.comments)
  author: User;

  @ManyToOne(() => Article, article => article.comments)
  article: Article;
}
