import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async editUser(
    currentUser: Users,
    userData: Users,
    file: Express.Multer.File,
  ) {
    let imgUrl: string;

    if (!file) {
      imgUrl = '';
    } else {
      imgUrl = file.path;
    }

    const editUserData = imgUrl
      ? {
          imgUrl: 'http://localhost:8080/' + imgUrl,
          lastName: userData.lastName,
          firstName: userData.firstName,
        }
      : {
          lastName: userData.lastName,
          firstName: userData.firstName,
        };

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
}
