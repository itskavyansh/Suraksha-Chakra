export interface ValidationResult {
  isValid: boolean;
  errorKey?: string;
}

export function validateName(name: string): ValidationResult {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 60) {
    return { isValid: false, errorKey: 'auth.validationName' };
  }
  return { isValid: true };
}

export function validatePhone(phone: string): ValidationResult {
  const cleaned = phone.trim();
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(cleaned)) {
    return { isValid: false, errorKey: 'auth.validationPhone' };
  }
  return { isValid: true };
}

export function validatePin(pin: string): ValidationResult {
  const pinRegex = /^\d{4}$/;
  if (!pinRegex.test(pin.trim())) {
    return { isValid: false, errorKey: 'auth.validationPin' };
  }
  return { isValid: true };
}

export function validatePinsMatch(pin: string, confirmPin: string): ValidationResult {
  if (pin !== confirmPin) {
    return { isValid: false, errorKey: 'auth.validationPinMatch' };
  }
  return { isValid: true };
}

export function isPhoneDuplicate(phone: string, existingPhones: string[]): boolean {
  const cleaned = phone.trim();
  return existingPhones.includes(cleaned);
}
