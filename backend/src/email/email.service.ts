import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly mailerService: MailerService,
    private jwt: JwtService,
  ) {}

  async sendVerificationEmail(email: string) {
    const { access_token: token } = await this.signVerificationToken(email);

    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'promenergo.typography@gmail.com',
        subject: 'Email verification',
        text:
          'To verificate your email click on link: http://localhost:3000/verification/' +
          token,
      });

      return { message: 'Email sent successfully' };
    } catch (err) {
      return err;
    }
  }

  async signVerificationToken(email: string) {
    const payload = {
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1m',
      secret: process.env.JWT_SECRET,
    });

    return {
      access_token: token,
    };
  }

  async verificateEmail(user: Users) {
    try {
      await this.usersRepository.update(
        { email: user.email },
        { ...user, isVerificated: true },
      );

      return { message: 'Successfully verificated' };
    } catch (err) {
      return err;
    }
  }
}
