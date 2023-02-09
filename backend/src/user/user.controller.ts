import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { Users } from 'src/entities/users/users.entity';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { multerConfig } from 'configs';

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
  @UseInterceptors(FileInterceptor('file', multerConfig))
  editMe(
    @GetUser() currentUser: Users,
    @Req() req: Request<Users>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.editUser(currentUser, req.body, file);
  }
}
