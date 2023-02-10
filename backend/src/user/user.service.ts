import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user/user.entity';
import { Repository } from 'typeorm';
import { UrlService } from '../services/url/url.service';
import { serverPort } from '../../constants';
import { UserDto } from './dto/user.dto';
import { ImageService } from '../services/image/image.service';

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
    private imageService: ImageService,
  ) {}

  public async editUser(
    currentUserId: string,
    userDto: UserDto,
    file: Express.Multer.File,
  ) {
    const editUserData: editUserData = {
      lastName: userDto.lastName,
      firstName: userDto.firstName,
    };

    if (file) {
      const [, ext] = file.mimetype.split('/');
      this.imageService.saveImages(ext, file);
      editUserData.imgUrl =
        this.urlService.createBaseUrl(serverPort) + file.path;
    }

    try {
      await this.usersRepository.update({ id: currentUserId }, editUserData);
      return await this.usersRepository.findOne({
        where: {
          id: currentUserId,
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
}
