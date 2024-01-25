import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from '../enums/role.enum'
import { Article } from './article.entity';
import { Comment } from './comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  role?: Role;

  @Column({ nullable: true })
  birthdate?: Date;

  @Column({ nullable: true })
  about?: string;

  @Column({ nullable: true })
  avatar?: string;

  @OneToMany(() => Article, article => article.author, { cascade: true })
  articles: Article[];

  @OneToMany(() => Comment, comment => comment.author, { cascade: true })
  comments: Comment[];
}
