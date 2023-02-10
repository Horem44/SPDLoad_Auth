import { UrlService } from './url.service';

describe('UrlService', () => {
  describe('createBaseUrl', () => {
    it('should concatenate host and port', async () => {
      const urlService = new UrlService();
      const result = urlService.createBaseUrl(8080);
      
      expect(result).toBe('http://localhost:8080/');
    });
  });
});