import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user/user.entity';
import { UrlService } from 'src/services/url/url.service';
import { ImageService } from 'src/services/image/image.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UrlService, ImageService],
  controllers: [UserController],
})
export class UserModule {}
