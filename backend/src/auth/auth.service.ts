import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users/users.entity';
import { Repository } from 'typeorm';
import { SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwt: JwtService,
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

      return this.signToken(user.id, user.email);
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

  async signin(dto: SigninDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new ForbiddenException('Credentials incorrect');
      }

      const isPwMatches = await argon.verify(user.hash, dto.password);

      if (!isPwMatches) {
        throw new ForbiddenException('Credentials incorrect');
      }

      return this.signToken(user.id, user.email);
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

  async signToken(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });

    return {
      access_token: token,
    };
  }
}
