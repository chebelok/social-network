import { Body, Controller, Delete, Get, Post, Put, Res, UseGuards } from "@nestjs/common";
import { ArticleCategoryService } from "../services/articleCategory.servise";
import { AdminGuard } from "../guards/admin.guard";

@Controller()
export class ArticleCategoryController {
  constructor (
    private readonly articleCategoryService: ArticleCategoryService
  ) {}

  @Get('/categories')
  async getCategories(@Res() res) {
    try {
      const categories = await this.articleCategoryService.getAllCategories();
      res.status(200).send(categories);
    } catch (error) {
      res.status(500).send({ status: 'Server error', message: error.message });
    }
  }

  @Post('/category')
  @UseGuards(AdminGuard)
  async addCategory(@Body() body: { name: string }, @Res() res) {
    try {
      const category = await this.articleCategoryService.createCategory(body.name);
      res.status(200).send(category);
    } catch (error) {
      res.status(500).send({ status: 'Server error', message: error.message });
    }
  }

  @Put('/category')
  @UseGuards(AdminGuard)
  async updateCategory(@Body() body: { id: number, name: string }, @Res() res) {
    try {
      const category = await this.articleCategoryService.updateCategory(body.id, body.name);
      res.status(200).send(category);
    } catch (error) {
      res.status(500).send({ status: 'Server error', message: error.message });
    }
  }

  @Delete('/category')
  @UseGuards(AdminGuard)
  async deleteCategory (@Body() body: { id: number }, @Res() res) {
    try {
      const deleted = await this.articleCategoryService.deleteCategory(body.id);
      res.status(200).send(deleted);
    } catch (error) {
      res.status(500).send({ status: 'Server error', message: error.message });
    }
  }

}
