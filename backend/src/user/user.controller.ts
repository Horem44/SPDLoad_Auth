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
import { extname, join } from 'path';
import { multerConfig } from 'configs';
import { readFile } from 'fs';
import { promisify } from 'util';
import * as sharp from 'sharp';

const readFileAsync = promisify(readFile);

@Controller('users')
export class UserController {
  private readonly imgSizes: string[];
  constructor(private userService: UserService) {
    this.imgSizes = ['200x200', '400x400', '600x600'];
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: Users) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Post('edit')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async editMe(
    @GetUser() currentUser: Users,
    @Req() req: Request<Users>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const [, ext] = file.mimetype.split('/');
    this.saveImages(ext, file);
    return this.userService.editUser(currentUser, req.body, file);
  }

  private saveImages(ext: string, file: Express.Multer.File) {
    if (['jpeg', 'jpg', 'png'].includes(ext)) {
      this.imgSizes.forEach((s: string) => {
        const [size] = s.split('x');
        readFileAsync(file.path).then((b: Buffer) => {
          return sharp(b)
            .resize(+size)
            .toFile(
              join(__dirname, '..', '..', '..', 'public', s, file.filename),
            );
        });
      });
    }
  }
}
