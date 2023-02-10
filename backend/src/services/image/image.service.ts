import { Injectable } from '@nestjs/common';
import { readFile } from 'fs';
import { promisify } from 'util';
import * as sharp from 'sharp';
import { imgSizes, imgFormats } from '../../../constants';
import { join } from 'path';

const readFileAsync = promisify(readFile);

@Injectable()
export class ImageService {
  constructor() {}

  saveImages(ext: string, file: Express.Multer.File) {
    if (!imgFormats.includes(ext)) {
      return;
    }

    imgSizes.forEach((s: string) => {
      const [size] = s.split('x');
      readFileAsync(file.path).then((b: Buffer) => {
        return sharp(b)
          .resize(+size)
          .toFile(
            join(__dirname, '..', '..', '..', '..', 'public', s, file.filename),
          );
      });
    });
  }
}
