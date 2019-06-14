jest.mock('../../services/auth.service', () => ({
  validateToken: (token: string) => token === validToken,
}));

jest.mock('../../services/config.service', () => ({
  loadConfig: jest.fn(),
}));

import { authMiddleware } from '../auth.middleware';

const validToken = 'foo';
const invalidToken = 'bar';

describe('authMiddleware', () => {
  it('throws on no token', () => {
    return expect(authMiddleware(() => {}, null, null, { user: {} }, null)).rejects.toEqual(
      expect.any(Error),
    );
  });

  it('throws on invalid token', () => {
    return expect(
      authMiddleware(() => {}, null, null, { user: { token: invalidToken } }, null),
    ).rejects.toEqual(expect.any(Error));
  });

  it('executes resolver on valid token', () => {
    const expectedResult = 'expectedResult';
    return expect(
      authMiddleware(() => expectedResult, null, null, { user: { token: validToken } }, null),
    ).resolves.toBe(expectedResult);
  });
});
