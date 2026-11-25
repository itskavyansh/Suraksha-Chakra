import { describe, it, expect } from 'vitest';
import {
  validateName,
  validatePhone,
  validatePin,
  validatePinsMatch,
  isPhoneDuplicate,
} from './validators';

describe('Auth Validation Helpers', () => {
  describe('validateName', () => {
    it('accepts names between 2 and 60 characters', () => {
      expect(validateName('Ramesh Kumar').isValid).toBe(true);
      expect(validateName('Om').isValid).toBe(true);
      expect(validateName('A'.repeat(60)).isValid).toBe(true);
    });

    it('rejects names shorter than 2 or longer than 60 characters', () => {
      expect(validateName('').isValid).toBe(false);
      expect(validateName(' ').isValid).toBe(false);
      expect(validateName('A').isValid).toBe(false);
      expect(validateName('A'.repeat(61)).isValid).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('accepts valid 10-digit Indian phone numbers starting with 6, 7, 8, 9', () => {
      expect(validatePhone('9876543210').isValid).toBe(true);
      expect(validatePhone('8800112233').isValid).toBe(true);
      expect(validatePhone('7011223344').isValid).toBe(true);
      expect(validatePhone('6200112233').isValid).toBe(true);
    });

    it('rejects phone numbers that do not start with 6-9', () => {
      expect(validatePhone('5876543210').isValid).toBe(false);
      expect(validatePhone('1234567890').isValid).toBe(false);
      expect(validatePhone('0987654321').isValid).toBe(false);
    });

    it('rejects phone numbers with length other than 10 or non-digits', () => {
      expect(validatePhone('987654321').isValid).toBe(false); // 9 digits
      expect(validatePhone('98765432100').isValid).toBe(false); // 11 digits
      expect(validatePhone('98765abcde').isValid).toBe(false);
      expect(validatePhone('+919876543210').isValid).toBe(false);
    });
  });

  describe('validatePin and match', () => {
    it('accepts exactly 4 digits', () => {
      expect(validatePin('1234').isValid).toBe(true);
      expect(validatePin('0000').isValid).toBe(true);
      expect(validatePin('9999').isValid).toBe(true);
    });

    it('rejects pins with length not equal to 4 or containing non-digits', () => {
      expect(validatePin('123').isValid).toBe(false);
      expect(validatePin('12345').isValid).toBe(false);
      expect(validatePin('123a').isValid).toBe(false);
      expect(validatePin('').isValid).toBe(false);
    });

    it('validates PIN confirmation matching', () => {
      expect(validatePinsMatch('1234', '1234').isValid).toBe(true);
      expect(validatePinsMatch('1234', '5678').isValid).toBe(false);
      expect(validatePinsMatch('1234', '123').isValid).toBe(false);
    });
  });

  describe('isPhoneDuplicate', () => {
    const existing = ['9800000142', '9876543210', '9811223344'];

    it('detects duplicate phones', () => {
      expect(isPhoneDuplicate('9800000142', existing)).toBe(true);
      expect(isPhoneDuplicate('9876543210', existing)).toBe(true);
    });

    it('allows non-duplicate phones', () => {
      expect(isPhoneDuplicate('9899001122', existing)).toBe(false);
      expect(isPhoneDuplicate('7000000000', existing)).toBe(false);
    });
  });
});
