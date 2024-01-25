import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { verifyToken, decodeToken } from '../utils/token.util';
import { AuthResponseDTO } from '../DTO/authResponse.dto';
import { CurrentUserDTO } from '../DTO/currentUser.dto';
import { UserDTO } from '../DTO/user.dto';
import { log } from '../utils/logger.util';
import path = require('path');


dotenv.config();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userReposiroty: Repository<User>
  ) {}

  async register(
    name: string,
    email: string,
    password: string,
    birthdate: string,
    about: string
  ): Promise<AuthResponseDTO> {
    const candidateEmail = await this.userReposiroty.findOneBy({ email });
    if (candidateEmail)
      return { status: 'error', message: 'User already exists' };

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION_TIME
    });
    const birthdateNormalized = new Date(birthdate);
    const passwordHash = await bcrypt.hash(password, 3);

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = passwordHash;
    user.birthdate = birthdateNormalized;
    user.about = about;

    await AppDataSource.manager.save(user);
    return { status: 'success', token: token };
  }

  async signin(email: string, password: string): Promise<AuthResponseDTO> {
    try {
      const user = await this.userReposiroty.findOneBy({ email });
      if (!user) return { status: 'error', message: 'User not found' };

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect)
        return { status: 'error', message: 'Wrong password' };

      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME
      });

      return { status: 'success', token };
    } catch (error) {
      log(error);
    }
  }

  async resetPassword(
    newPassword: string,
    token: string
  ): Promise<AuthResponseDTO> {
    try {
      const isTokenValid = await verifyToken(token).catch((err) => !!!err);
      if (!isTokenValid)
        return {
          status: 'Error',
          message: 'Token expired'
        };

      const email = await decodeToken(token).then((payload) => payload.to);
      const passwordHash = await bcrypt.hash(newPassword, 3);

      const user = this.userReposiroty.findOneBy({ email });
      if (!user) return { status: 'Error', message: 'User not found' };

      await this.userReposiroty.update({ email }, { password: passwordHash });
      return { status: 'Success', message: 'Password has been changed' };
    } catch (error) {
      log(error);
    }
  }

  async filterAndPaginateUsers(
    token: string,
    search?: string,
    limit?: number,
    offset?: number
  ): Promise<{ status: string; message?: string; result?: User[] }> {
    try {
      const users = await this.userReposiroty
        .createQueryBuilder('user')
        .select()
        .where(
          `name iLIKE :search OR 
          email iLIKE :search OR 
          about iLIKE :search`,
          { search: `%${search}%` }
        )
        .limit(limit)
        .offset(offset)
        .getMany();

      if (!users) return { status: 'Error', message: 'Users not found' };

      const usersSecure = users.map((user) => {
        user.password = undefined;
        return user;
      });

      return {
        status: 'Success',
        result: usersSecure
      };
    } catch (error) {
      log(error);
    }
  }

  async createUser(user: UserDTO, token: string): Promise<AuthResponseDTO> {
    try {
      const email = await decodeToken(token).then(payload => payload.email)

      const candidateEmail = await this.userReposiroty.findOneBy({
        email: user.email
      });
      if (candidateEmail)
        return { status: 'Error', message: 'User already exists' };

      const passwordHash = await bcrypt.hash(user.password, 3);
      const birthdateNormalized = new Date(user.birthdate);

      const newUser = new User();
      newUser.name = user.name;
      newUser.email = user.email;
      newUser.password = passwordHash;
      newUser.birthdate = birthdateNormalized;
      newUser.about = user.about;

      await this.userReposiroty.save(newUser);
      return { status: 'Success', message: 'User has been created' };
    } catch (error) {
      log(error);
    }
  }

  async updateUser(newData: UserDTO, id: number, token: string): Promise<AuthResponseDTO> {
    try {
      const email = await decodeToken(token).then(payload => payload.email)

      const userToUpdate = await this.userReposiroty.findOneBy({ id: id });
      if (!userToUpdate) return { status: 'Error', message: 'User not found' };

      const checkEmail = await this.userReposiroty.findOneBy({
        email: newData.email
      });
      if (checkEmail && checkEmail.id !== userToUpdate.id)
        return { status: 'Error', message: 'User already exists' };

      await this.userReposiroty.update({ id: id }, newData);

      return { status: 'Success', message: 'User has been updated' };
    } catch (error) {
      log(error);
    }
  }

  async deleteUser(email: string, token: string): Promise<AuthResponseDTO> {
    try {
      const email = await decodeToken(token).then(payload => payload.email)

      const deleteUser = this.userReposiroty.delete({ email });
      if (!deleteUser) return { status: 'error', message: 'User not found' };
      return { status: 'success', message: 'User has been deleted' };
    } catch (error) {
      log(error);
    }
  }

  async uploadAvatar(file: Express.Multer.File, id: number) {
    try {
      const user = await this.userReposiroty.findOneBy({ id });
      if (!user) return { status: 'Error', message: 'User not found' };

      const avatarPath = path.join(process.cwd(), file.path);
      await this.userReposiroty.update({ id }, { avatar: avatarPath });
      return { status: 'Success', message: 'New avatar added' };
    } catch (error) {
      log(error);
    }
  }

  async getCurrentUser(token: string): Promise<CurrentUserDTO> {
    try {
      const isTokenValid = await verifyToken(token).catch((err) => !!!err);
      if (!isTokenValid)
        return {
          status: 'error',
          message: 'Invalid token. Authorization needed'
        };

      const email = await decodeToken(token).then((payload) => payload.email);

      const searchResult = await this.userReposiroty.findOneBy({ email });
      if (!searchResult) return { status: 'error', message: 'User not found' };

      return { status: 'success', result: searchResult };
    } catch (error) {
      log(error);
    }
  }

  async isAdmin(email: string) {
    try {
      const user = await this.userReposiroty.findOneBy({ email });
      return user && user.role === 'ADMIN';
    } catch (error) {
      log(error);
    }
  }

  async getUserByEmail(email: string) {
    try {
      if (!email) return { status: 'Error', message: 'Email is required' };
      const user = await this.userReposiroty.findOneBy({ email });
      return user;
    } catch (error) {
      log(error);
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.userReposiroty.findOneBy({ id })
      return user
    } catch (error) {
      log(error)
    }
  }
}
