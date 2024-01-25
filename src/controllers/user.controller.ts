import { Controller, Get, Response, Delete, Param, Put, Body, Post, Query, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, Headers, UseGuards } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { UserDTO } from "../DTO/user.dto";
import { QueryOptionsDTO } from "../DTO/queryOptions.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";
import path = require("path");
import { Token } from "../decorators/token.decorator";
import { AdminGuard } from "../guards/admin.guard";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users')
  @UseGuards(AdminGuard)
  async getUsers(@Response() res, @Query() options: QueryOptionsDTO, @Token() token: string) {
    try {
      const queryResult = await this.userService.filterAndPaginateUsers(token, options.search, options.limit, options.offset);
      res.status(200).send(queryResult);
    } catch (error) { 
      return res.status(500).send({ status: 'Server error', message: error.message });
    }
  }
  
  @Post('/user/:id/file')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(jpg|HEIC|png|jpeg)$/))
        cb(null, true);
      else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    },
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '');
        const extension: string = path.parse(file.originalname).ext;

        cb(null, `${filename}${extension}`);
      }
    })
  }))
  async uploadUserPicture(@Param('id') id: number, @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: +process.env.MAX_FILE_SIZE })
      ]
    })
  ) file, @Response() res) {
    try {
      const uploadResult = await this.userService.uploadAvatar(file, id);
      if (uploadResult.status === 'Error') res.status(404).send(uploadResult);
      else res.status(200).send(uploadResult);
    } catch (error) {
      return res.status(500).send({ status: 'Server error', message: error.message });
    }
  }

  @Post('/user')
  @UseGuards(AdminGuard)
  async createUser(@Response() res, @Body() body: UserDTO, @Token() token: string) {
    try {
      const createdUser = await this.userService.createUser({ ...body }, token);
      if (createdUser.status === 'Error') res.status(404).send(createdUser);
      else res.status(200).send(createdUser);
    } catch (error) {
      return res.status(500).send({ status: 'Server error', message: error.message });
    }
  }

  @Put('/user/:id')
  @UseGuards(AdminGuard)
  async updateUser(@Response() res, @Body() body: UserDTO, @Param('id') id: number, @Token() token: string) {
    try {
      const updatedUser = await this.userService.updateUser({ ...body }, id, token);
      if (updatedUser.status === 'Error') res.status(404).send(updatedUser);
      else res.status(200).send(updatedUser);
    } catch (error) { 
      return res.status(500).send({ status: 'Server error', message: error.message });
    }
  }

  @Delete('/user/:email')
  @UseGuards(AdminGuard)
  async deleteUser(@Param('email') email: string, @Response() res, @Token() token: string) {
    try {
      const deletedUser = await this.userService.deleteUser(email, token);
      if (deletedUser.status === 'Error') res.status(404).send(deletedUser);
      else res.status(200).send(deletedUser);
    } catch (error) {
      return res.status(500).send({ status: 'Server error', message: error.message });
    }
  }
}