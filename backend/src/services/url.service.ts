import { Injectable } from '@nestjs/common';
import { host, port } from '../../constants';

@Injectable()
export class UrlService {
  constructor() {}

  createBaseUrl() {
    return host + ':' + port + '/';
  }
}
