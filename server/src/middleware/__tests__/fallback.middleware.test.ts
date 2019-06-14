import { fallbackMiddleware } from '../fallback.middleware';

describe('fallbackMiddleware', () => {
  it('always throws', () => {
    return expect(fallbackMiddleware(() => {}, null, null, null, null)).rejects.toEqual(
      expect.any(Error),
    );
  });
});
