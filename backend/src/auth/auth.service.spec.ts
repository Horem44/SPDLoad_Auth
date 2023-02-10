import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { User } from '../entities/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
  }),
);

describe('AuthService', () => {
  let repositoryMock: MockType<Repository<User>>;
  let jwtService: JwtService;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    repositoryMock = moduleRef.get(getRepositoryToken(User));
    authService = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    it('should call findOne', async () => {
      // Arrange
      const findOneSpy = jest.spyOn(repositoryMock, 'findOne');

      // Act
      await authService.signup(<SignupDto>{ password: 'password' });

      // Assert
      expect(findOneSpy).toBeCalledWith({
        where: expect.anything(),
      });
    });

    it('should throw error if user exists', async () => {
      // Arrange
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => <User>{});

      // Act
      const result = await authService.signup(<SignupDto>{
        password: 'password',
      });

      // Assert
      expect(result).toStrictEqual({
        statusCode: 403,
        message: 'Credentials taken',
        error: 'Forbidden',
      });
    });

    it('should call save', async () => {
      // Arrange
      const saveSpy = jest.spyOn(repositoryMock, 'save');
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => null);
      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(() => Promise.resolve('token'));
      jest
        .spyOn(argon, 'hash')
        .mockImplementation(() => Promise.resolve('hash'));

      // Act
      await authService.signup(<SignupDto>{
        lastName: 'lastName',
        firstName: 'firstName',
        email: 'email',
      });

      // Assert
      expect(saveSpy).toBeCalledWith(
        expect.objectContaining({
          lastName: 'lastName',
          firstName: 'firstName',
          email: 'email',
          hash: 'hash',
        }),
      );
    });

    it('should return token', async () => {
      // Arrange
      const saveSpy = jest.spyOn(repositoryMock, 'save');
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => null);
      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(() => Promise.resolve('token'));
      jest
        .spyOn(argon, 'hash')
        .mockImplementation(() => Promise.resolve('hash'));

      // Act
      const result = await authService.signup(<SignupDto>{
        lastName: 'lastName',
        firstName: 'firstName',
        email: 'email',
      });

      // Assert
      expect(result).toStrictEqual({ access_token: 'token' });
    });
  });

  describe('signin', () => {
    it('should call findOne', async () => {
      // Arrange
      const findOneSpy = jest.spyOn(repositoryMock, 'findOne');

      // Act
      await authService.signin(<SigninDto>{ password: 'password' });

      // Assert
      expect(findOneSpy).toBeCalledWith({
        where: expect.anything(),
      });
    });

    it('should return error if user not found', async () => {
      // Arrange
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => null);

      // Act
      const result = await authService.signin(<SigninDto>{
        password: 'password',
      });

      // Assert
      expect(result).toStrictEqual({
        statusCode: 403,
        message: 'Credentials incorrect',
        error: 'Forbidden',
      });
    });

    it('should return token if passwords matches', async () => {
      // Arrange
      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(() => Promise.resolve('token'));
      jest
        .spyOn(argon, 'verify')
        .mockImplementation(() => Promise.resolve(true));

      // Act
      const result = await authService.signin(<SigninDto>{
        password: 'password',
      });

      // Assert
      expect(result).toStrictEqual({
        access_token: 'token',
      });
    });

    it('should return error if passwords dont match', async () => {
      // Arrange
      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(() => Promise.resolve('token'));
      jest
        .spyOn(argon, 'verify')
        .mockImplementation(() => Promise.resolve(false));

      // Act
      const result = await authService.signin(<SigninDto>{
        password: 'password',
      });

      // Assert
      expect(result).toStrictEqual({
        statusCode: 403,
        message: 'Credentials incorrect',
        error: 'Forbidden',
      });
    });
  });
});
