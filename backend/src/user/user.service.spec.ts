import { UserService } from './user.service';
import { Test } from '@nestjs/testing';
import { UrlService } from '../services/url/url.service';
import { ImageService } from '../services/image/image.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserDto } from './dto';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
  }),
);

describe('UserService', () => {
  let repositoryMock: MockType<Repository<User>>;
  let userService: UserService;
  let urlService: UrlService;
  let imageService: ImageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        UrlService,
        ImageService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    repositoryMock = moduleRef.get(getRepositoryToken(User));
    urlService = moduleRef.get<UrlService>(UrlService);
    imageService = moduleRef.get<ImageService>(ImageService);
  });

  describe('edit', () => {
    it('should save file', async () => {
      // Arrange
      const saveImagesSpy = jest.spyOn(imageService, 'saveImages');

      // Act
      await userService.editUser(
        '',
        <UserDto>{},
        <Express.Multer.File>{ mimetype: '/' },
      );

      // Assert
      expect(saveImagesSpy).toBeCalledWith(expect.anything(), <
        Express.Multer.File
      >{
        mimetype: '/',
      });
    });

    it('should not save file if no file provided', async () => {
      // Arrange
      const saveImagesSpy = jest.spyOn(imageService, 'saveImages');

      // Act
      await userService.editUser('', <UserDto>{}, null);

      //Assert
      expect(saveImagesSpy).not.toBeCalled();
    });

    it('should set imgUrl', async () => {
      // Arrange
      const updateSpy = jest.spyOn(repositoryMock, 'update');
      jest
        .spyOn(urlService, 'createBaseUrl')
        .mockImplementation(() => 'baseUrl/');

      // Act
      await userService.editUser(
        '',
        <UserDto>{},
        <Express.Multer.File>{
          mimetype: '/',
          path: '1234',
        },
      );

      //Assert
      expect(updateSpy).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          imgUrl: 'baseUrl/1234',
        }),
      );
    });

    it('should not set imgUrl if no file provided', async () => {
      // Arrange
      const updateSpy = jest.spyOn(repositoryMock, 'update');
      jest
        .spyOn(urlService, 'createBaseUrl')
        .mockImplementation(() => 'baseUrl/');

      // Act
      await userService.editUser('', <UserDto>{}, null);

      //Assert
      expect(updateSpy).toBeCalledWith(
        expect.anything(),
        expect.not.objectContaining({
          imgUrl: 'baseUrl/1234',
        }),
      );
    });

    it('should return updated user object', async () => {
      // Arrange
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => ({
        lastName: 'name',
      }));

      // Act
      const result = await userService.editUser('', <UserDto>{}, null);

      //Assert
      expect((<User>result).lastName).toBe('name');
    });

    it('should throw an exception on updating user', async () => {
      // Arrange
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => {
        throw new Error('error');
      });

      // Act
      const result = await userService.editUser('', <UserDto>{}, null);

      //Assert
      expect(result).toStrictEqual({
        statusCode: 500,
        message: 'Internal server error',
        error: 'Server Error',
      });
    });
  });
});
