import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { SignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('sign-up')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('sign-in')
  signin() {}
}
