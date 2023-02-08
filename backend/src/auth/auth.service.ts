import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users/users.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async signup(dto: SignupDto) {
    const hash = await argon.hash(dto.password);

    try {
      const existingUser = await this.usersRepository.findOne({
        where: {
          email: dto.email,
        },
      });

      if (existingUser) {
        throw new ForbiddenException('Credentials taken');
      }

      const user = await this.usersRepository.save({
        lastName: dto.lastName,
        firstName: dto.firstName,
        email: dto.email,
        hash,
      });

      return user;
    } catch (err) {
      if (!err.response) {
        return {
          statusCode: 500,
          message: 'Internal server error',
          error: 'Server Error',
        };
      }

      return err.response;
    }
  }
}
