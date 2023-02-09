import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Users } from 'src/entities/users/users.entity';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @UseGuards(JwtGuard)
  @Post('send-verification')
  sendVerificationEmail(@Body() { email }: { email: string }) {
    return this.emailService.sendVerificationEmail(email);
  }

  @UseGuards(JwtGuard)
  @Get('verificate')
  verificateEmail(
    @Body() { email }: { email: string },
    @GetUser() user: Users,
  ) {
    return this.emailService.verificateEmail(user);
  }
}
