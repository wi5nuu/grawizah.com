/**
 * Input Validation Utilities
 * Prevents XSS, SQL injection, and validates user input
 */

import { ValidationError } from './errorHandler';

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Validate HS Code format
 */
export function validateHSCode(code: string): boolean {
  // HS Code should be 6-10 digits
  const hsCodeRegex = /^\d{6,10}$/;
  return hsCodeRegex.test(code);
}

/**
 * Validate phone number (international format)
 */
export function validatePhoneNumber(phone: string): boolean {
  // Basic international phone validation
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate file upload
 */
export function validateFile(
  file: File,
  maxSize: number = 10 * 1024 * 1024, // 10MB default
  allowedTypes: string[] = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSize / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !allowedTypes.includes(extension)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Validate required fields
 */
export function validateRequired(
  data: Record<string, any>,
  requiredFields: string[]
): void {
  const missing: string[] = [];

  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      missing.push(field);
    }
  }

  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missing.join(', ')}`,
      missing.reduce((acc, field) => ({ ...acc, [field]: 'This field is required' }), {})
    );
  }
}

/**
 * Validate number range
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = 'Value'
): void {
  if (value < min || value > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max}`
    );
  }
}

/**
 * Validate string length
 */
export function validateStringLength(
  value: string,
  min: number,
  max: number,
  fieldName: string = 'Field'
): void {
  if (value.length < min || value.length > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max} characters`
    );
  }
}

/**
 * Prevent SQL injection in search queries
 */
export function sanitizeSearchQuery(query: string): string {
  // Remove SQL keywords and special characters
  return query
    .replace(/[';--]/g, '')
    .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b/gi, '')
    .trim();
}

/**
 * Validate date format (ISO 8601)
 */
export function validateDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validate price range
 */
export function validatePriceRange(min: number, max: number): void {
  if (min < 0) {
    throw new ValidationError('Minimum price cannot be negative');
  }

  if (max < min) {
    throw new ValidationError('Maximum price must be greater than minimum price');
  }
}
