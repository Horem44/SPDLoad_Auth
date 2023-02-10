import {
  Controller,
  Get,
  HttpCode,
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
import { User } from 'src/entities/user/user.entity';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'configs';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Get('')
  get(@GetUser() user: User) {
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Patch('edit')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async edit(
    @GetUser() currentUser: User,
    @Req() req: Request<User>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.editUser(currentUser, req.body, file);
  }
}
