import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { User } from 'src/entities/user/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'configs';
import { UserDto } from './dto';

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
  @Patch('')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async edit(
    @GetUser() currentUser: User,
    @Body() dto: UserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.editUser(currentUser.id, dto, file);
  }
}
