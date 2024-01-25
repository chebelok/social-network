import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';

import { EmailOptionsData } from '../datas/email.data';
import { mailTemplate } from '../templates/mail.template';
import { AuthResponseDTO } from '../DTO/authResponse.dto';
import { User } from '../entities/user.entity';
import { log } from '../utils/logger.util';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    @InjectRepository(User) private readonly userReposiroty: Repository<User>
  ) {}

  async sendEmail({ to }: EmailOptionsData): Promise<AuthResponseDTO> {
    try {
      const user = await this.userReposiroty.findOneBy({ email: to });
      if (!user) 
        return { status: 'ErrNotFound', message: `User with email: ${to} not found` };

      const uniqueToken = jwt.sign({ to }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      const link = process.env.RESET_PASSWD_URL + uniqueToken;
      const html = mailTemplate.replace('LINK', link);

      await this.mailerService.sendMail({
        to,
        subject: 'Access recovery',
        html
      });
      return { status: 'Success', message: `Email has been sent to: ${to}` };
    } catch (error) {
      log(error)
    }
  }
}
