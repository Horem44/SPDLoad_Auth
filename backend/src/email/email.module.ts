import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/strategy';
import { User } from 'src/entities/user/user.entity';
import { UrlService } from 'src/services/url/url.service';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  controllers: [EmailController],
  providers: [EmailService, JwtStrategy, UrlService],
})
export class EmailModule {}
