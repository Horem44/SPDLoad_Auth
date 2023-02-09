import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users/users.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.googlemail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: 'promenergo.typography@gmail.com',
          pass: 'caueqicjetbzxvgt',
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@gmail.com>',
      },
      preview: false,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      entities: [Users],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    EmailModule,
  ],
})
export class AppModule {}
