import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user/user.entity';
import { UrlService } from 'src/services/url.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UrlService],
  controllers: [UserController],
})
export class UserModule {}
