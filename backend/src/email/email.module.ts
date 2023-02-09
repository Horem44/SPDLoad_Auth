import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/strategy';
import { Users } from 'src/entities/users/users.entity';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), JwtModule.register({})],
  controllers: [EmailController],
  providers: [EmailService, JwtStrategy],
})
export class EmailModule {}
