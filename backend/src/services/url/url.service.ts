import { Injectable } from '@nestjs/common';
import { host } from '../../../constants';

@Injectable()
export class UrlService {
  constructor() {}

  createBaseUrl(port: number) {
    return host + ':' + port + '/';
  }
}
