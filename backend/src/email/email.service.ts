import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { clientPort } from '../../constants';
import { User } from 'src/entities/user/user.entity';
import { UrlService } from 'src/services/url.service';
import { Repository } from 'typeorm';
import { EmailDto } from './dto';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private urlService: UrlService,
    private jwt: JwtService,
  ) {}

  public async sendVerificationEmail(dto: EmailDto) {
    const email = dto.email;
    const { access_token: token } = await this.signVerificationToken(email);

    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'promenergo.typography@gmail.com',
        subject: 'Email verification',
        text:
          'To verificate your email click on link: ' +
          this.urlService.createBaseUrl(clientPort) +
          'verification/' +
          token,
      });

      return { message: 'Email sent successfully' };
    } catch (err) {
      return err;
    }
  }

  private async signVerificationToken(email: string) {
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

  public async verificateEmail(user: User) {
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
