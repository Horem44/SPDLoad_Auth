import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';
import { readFile } from 'fs';
import { promisify } from 'util';
import * as sharp from 'sharp';
import { UrlService } from 'src/services/url.service';
import { imgSizes, serverPort } from '../../constants';
import { UserDto } from './dto/user.dto';

const readFileAsync = promisify(readFile);

interface editUserData {
  lastName: string;
  firstName: string;
  imgUrl?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private urlService: UrlService,
  ) {}

  public async editUser(
    currentUser: User,
    userData: UserDto,
    file: Express.Multer.File,
  ) {
    const editUserData: editUserData = {
      lastName: userData.lastName,
      firstName: userData.firstName,
    };

    if (file) {
      const [, ext] = file.mimetype.split('/');
      this.saveImages(ext, file);
      editUserData.imgUrl = this.urlService.createBaseUrl(serverPort) + file.path;
    }

    try {
      await this.usersRepository.update({ id: currentUser.id }, editUserData);
      return await this.usersRepository.findOne({
        where: {
          id: currentUser.id,
        },
      });
    } catch (err) {
      return {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Server Error',
      };
    }
  }

  private saveImages(ext: string, file: Express.Multer.File) {
    if (['jpeg', 'jpg', 'png'].includes(ext)) {
      imgSizes.forEach((s: string) => {
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
