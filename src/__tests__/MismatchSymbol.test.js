import { getBeforeDotValue } from "../utility";

describe('getBeforeDotValue', () => {

    // Returns the input string if it does not contain a dot
    it('should return the input string when it does not contain a dot', () => {
      const inputString = 'hello';
      const result = getBeforeDotValue(inputString);
      expect(result).toBe(inputString);
    });

    // Returns the substring before the first dot in the input string
    it('should return the substring before the first dot in the input string', () => {
      const inputString = 'hello.world';
      const result = getBeforeDotValue(inputString);
      expect(result).toBe('hello');
    });

    // Returns an empty string if the input string is an empty string
    it('should return an empty string when the input string is empty', () => {
      const inputString = '';
      const result = getBeforeDotValue(inputString);
      expect(result).toBe('');
    });

    // Returns the input string if it ends with a dot
    it('should return the input string when it ends with a dot', () => {
      const inputString = 'hello.';
      const result = getBeforeDotValue(inputString);
      expect(result).toBe('hello');
    });

    // Returns the input string if it contains only a dot
    it('should return the input string when it contains only a dot', () => {
      const inputString = '.';
      const result = getBeforeDotValue(inputString);
      expect(result).toBe('');
    });

    // Returns the input string if it contains multiple dots
    it('should return the input string when it contains multiple dots', () => {
      const inputString = 'hello.world.test';
      const result = getBeforeDotValue(inputString);
      expect(result).toBe('hello');
    });

    // Returns null if the input string is null
    it('should return null when the input string is null', () => {
      const inputString = null;
      const result = getBeforeDotValue(inputString);
      expect(result).toBeNull();
    });

    // Returns the input string if it starts with a dot
    it('should return the input string when it starts with a dot', () => {
      const inputString = '.hello';
      const result = getBeforeDotValue(inputString);
      expect(result).toBe('');
    });
});