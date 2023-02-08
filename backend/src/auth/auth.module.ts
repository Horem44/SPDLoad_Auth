import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
