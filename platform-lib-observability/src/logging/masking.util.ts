/**
 * @file Provides a utility function for masking sensitive data within objects.
 * @description This utility is essential for implementing the security requirement
 * to prevent sensitive information like passwords and tokens from appearing in logs.
 * It recursively traverses an object and redacts values for specified keys.
 */

export const DEFAULT_SENSITIVE_FIELDS: string[] = [
  'password',
  'token',
  'authorization',
  'accesstoken',
  'refreshtoken',
  'apikey',
  'secret',
  'clientsecret',
  'creditcard',
  'cvv',
  'cardnumber',
];

const MASK_PLACEHOLDER = '[MASKED]';
const MAX_DEPTH = 20; // To prevent infinite recursion on circular references

/**
 * Recursively traverses an object or array and masks the values of keys
 * that are present in the sensitiveFields array. The check is case-insensitive.
 *
 * @param data The object or array to be sanitized.
 * @param sensitiveFields An array of keys whose values should be masked.
 * @param depth The current recursion depth to prevent stack overflow.
 * @returns A new object or array with sensitive data masked.
 */
export function maskData(
  data: any,
  sensitiveFields: string[],
  depth = 0,
): any {
  if (depth > MAX_DEPTH) {
    return '[MAX_DEPTH_REACHED]';
  }

  if (data === null || data === undefined) {
    return data;
  }

  // Handle arrays by masking each item
  if (Array.isArray(data)) {
    return data.map((item) => maskData(item, sensitiveFields, depth + 1));
  }

  // Handle non-object types
  if (typeof data !== 'object' || data instanceof Date) {
    return data;
  }

  // Deep clone the object to avoid mutating the original log context
  const sanitizedObject: Record<string, any> = { ...data };
  const lowercasedSensitiveFields = sensitiveFields.map((field) =>
    field.toLowerCase(),
  );

  for (const key in sanitizedObject) {
    // Check if the key is one of the object's own properties
    if (Object.prototype.hasOwnProperty.call(sanitizedObject, key)) {
      const lowercasedKey = key.toLowerCase();

      if (lowercasedSensitiveFields.includes(lowercasedKey)) {
        sanitizedObject[key] = MASK_PLACEHOLDER;
      } else {
        // Recurse for nested objects and arrays
        sanitizedObject[key] = maskData(
          sanitizedObject[key],
          sensitiveFields,
          depth + 1,
        );
      }
    }
  }

  return sanitizedObject;
}