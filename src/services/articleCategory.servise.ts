import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ArticleCategory } from "../entities/articleCategory.entity";
import { log } from '../utils/logger.util';

@Injectable()
export class ArticleCategoryService {
  constructor(
    @InjectRepository(ArticleCategory) private readonly articleCategoryRepository: Repository<ArticleCategory>
  ) {}

  async getAllCategories() {
    try {
      const allCategories = await this.articleCategoryRepository.find();
      return allCategories;
    } catch (error) {
      log(error)
    }
  }

  async getCategoryByName(name: string) {
    try {
      return await this.articleCategoryRepository.findOne({
        where: {
          name
        }
      })
    } catch (error) {
      log(error);
    }
  }

  async getCategoryById(id: number) {
    try {
      return await this.articleCategoryRepository.findOne({
        where: {
          id
        }
      })
    } catch (error) {
      log(error);
    }
  }

  async createCategory(name: string) {
    try {
      const category = new ArticleCategory(name);
      return await this.articleCategoryRepository.save(category);
    } catch (error) {
      log(error);
    }
  }

  async deleteCategory(id: number) {
    try {
      return await this.articleCategoryRepository.delete(id);
    } catch (error) {
      log(error);
    }
  }

  async updateCategory(id: number, name: string) {
    try {
      const category = await this.articleCategoryRepository.findOneBy({ id });
      category.name = name;
      return await this.articleCategoryRepository.save(category);
    } catch (error) {
      log(error);
    }
  }
}
