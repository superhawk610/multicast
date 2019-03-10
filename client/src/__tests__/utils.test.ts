import { chunk, words, upperFirst, startCase } from '../utils';

describe('utils', () => {
  describe('utils // chunk', () => {
    it('returns an empty array when provided an empty array', () => {
      expect(chunk([], 3)).toEqual([]);
    });

    it('returns a nested array when arr.length === chunk size', () => {
      expect(chunk([1], 3)).toEqual([[1]]);
    });

    it('returns a single partial chunk when insufficient elements exist', () => {
      expect(chunk([1, 2], 3)).toEqual([[1, 2]]);
    });

    it('returns a trailing partial chunk when there are leftover elements', () => {
      expect(chunk([1, 2, 3, 4], 3)).toEqual([[1, 2, 3], [4]]);
    });

    it('returns an array of full chunks when there are no leftover elements', () => {
      expect(chunk([1, 2, 3, 4, 5, 6], 3)).toEqual([[1, 2, 3], [4, 5, 6]]);
    });
  });

  describe('utils // words', () => {
    it('returns null when provided an empty string', () => {
      expect(words('')).toBe(null);
    });

    it('returns the string provided wrapped in an array when it contains only a single word', () => {
      expect(words('foo')).toEqual(['foo']);
    });

    it('returns an array of words when provided a space-delimited set of words', () => {
      expect(words('foo bar')).toEqual(['foo', 'bar']);
    });

    it('returns an array of words when provided a hyphen-delimited set of words', () => {
      expect(words('foo-bar')).toEqual(['foo', 'bar']);
    });

    it('returns an array of words when provided a mixed-delimited set of words', () => {
      expect(words('foo bar-baz')).toEqual(['foo', 'bar', 'baz']);
    });
  });

  describe('utils // upperFirst', () => {
    it('does nothing when provided an empty string', () => {
      expect(upperFirst('')).toBe('');
    });

    it('capitalizes the first character of the provided string', () => {
      expect(upperFirst('foo')).toBe('Foo');
    });
  });

  describe('utils // startCase', () => {
    it('does nothing when provided an empty string', () => {
      expect(startCase('')).toBe('');
    });

    it('does nothing when provided a string in start case', () => {
      expect(startCase('Foo Bar')).toBe('Foo Bar');
    });

    it('capitalizes the first letter of each word in the provided string', () => {
      expect(startCase('foo bar')).toBe('Foo Bar');
    });
  });
});
