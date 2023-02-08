import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { Users } from 'src/entities/users/users.entity';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: Users) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Post('edit')
  editMe(@GetUser() currentUser: Users, @Req() req: Request<Users>) {
    return this.userService.editUser(currentUser, req.body);
  }
}
