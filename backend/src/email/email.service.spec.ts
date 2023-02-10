import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { User } from '../entities/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailService } from './email.service';
import { UrlService } from '../services/url/url.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailDto } from './dto';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
  }),
);

export const mailerMockFactory: () => MockType<MailerService> = jest.fn(() => ({
  sendMail: jest.fn(() => Promise.resolve()),
}));

describe('UserService', () => {
  let repositoryMock: MockType<Repository<User>>;
  let emailService: EmailService;
  let urlService: UrlService;
  let jwtService: JwtService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EmailService,
        UrlService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: MailerService,
          useFactory: mailerMockFactory,
        },
      ],
    }).compile();

    mailerService = moduleRef.get(MailerService);
    emailService = moduleRef.get<EmailService>(EmailService);
    repositoryMock = moduleRef.get(getRepositoryToken(User));
    urlService = moduleRef.get<UrlService>(UrlService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('sendVerificationEmail', () => {
    it('should call mailer service', async () => {
      // Arrange
      const sendMailSpy = jest.spyOn(mailerService, 'sendMail');
      const dto = { email: 'email' };
      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(() => Promise.resolve('token'));

      // Act
      await emailService.sendVerificationEmail(dto);

      // Assert
      expect(sendMailSpy).toBeCalledWith(
        expect.objectContaining({
          to: dto.email,
          from: 'promenergo.typography@gmail.com',
          subject: 'Email verification',
        }),
      );
    });

    it('should set token', async () => {
      // Arrange
      const sendMailSpy = jest.spyOn(mailerService, 'sendMail');
      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(() => Promise.resolve('token'));
      jest
        .spyOn(urlService, 'createBaseUrl')
        .mockImplementation(() => 'baseUrl');

      // Act
      await emailService.sendVerificationEmail(<EmailDto>{});

      // Assert
      expect(sendMailSpy).toBeCalledWith(
        expect.objectContaining({
          text:
            'To verificate your email click on link: ' +
            'baseUrl' +
            'verification/' +
            'token',
        }),
      );
    });

    it('should return successfull message', async () => {
      // Arrange
      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(() => Promise.resolve('token'));

      // Act
      const result = await emailService.sendVerificationEmail(<EmailDto>{});

      // Assert
      expect(result).toStrictEqual({ message: 'Email sent successfully' });
    });

    it('should return error if no token provided', async () => {
      // Act
      const result = await emailService.sendVerificationEmail(<EmailDto>{});

      // Assert
      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('verificateEmail', () => {
    it('should call update', async () => {
      // Arrange
      const updateSpy = jest.spyOn(repositoryMock, 'update');
      const user = { email: 'email' };

      // Act
      await emailService.verificateEmail(<User>user);

      // Assert
      expect(updateSpy).toBeCalledWith(
        {
          email: 'email',
        },
        { ...user, isVerificated: true },
      );
    });

    it('should return successfull message if user exists', async () => {
      // Arrange
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => <User>{});

      // Act
      const result = await emailService.verificateEmail(<User>{});

      // Assert
      expect(result).toStrictEqual({ message: 'Successfully verificated' });
    });

    it('should return error if user not exists', async () => {
      // Arrange
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => null);

      // Act
      const result = await emailService.verificateEmail(<User>{});

      // Assert
      expect(result).toBeInstanceOf(Error);
    });
  });
});
