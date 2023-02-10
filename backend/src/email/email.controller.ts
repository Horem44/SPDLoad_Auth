import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from 'src/entities/user/user.entity';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Post('send-verification')
  sendVerificationEmail(@Body() { email }: { email: string }) {
    return this.emailService.sendVerificationEmail(email);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Get('verificate')
  verificateEmail(@GetUser() user: User) {
    return this.emailService.verificateEmail(user);
  }
}
