/**
 * Formats a phone number to +x (xxx) xxx-xxxx format
 * @param value - The phone number string to format
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters except +
  const cleaned = value.replace(/[^\d+]/g, "");
  
  // Extract digits (remove + if present)
  let digits = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;
  
  // Limit to 10 digits (US/Canada format: 1 + 9 more digits)
  digits = digits.slice(0, 10);
  
  // Format as +x (xxx) xxx-xxxx
  if (digits.length === 0) {
    return "";
  }
  
  let formatted = "+";
  
  // First digit (country code, typically 1)
  if (digits.length > 0) {
    formatted += digits[0];
  }
  
  // Area code: (xxx)
  if (digits.length > 1) {
    formatted += ` (${digits.slice(1, 4)}`;
  }
  
  // Close parenthesis if we have at least 4 digits
  if (digits.length >= 4) {
    formatted += ")";
  }
  
  // Exchange code: xxx
  if (digits.length > 4) {
    formatted += ` ${digits.slice(4, 7)}`;
  }
  
  // Last 4 digits: -xxxx
  if (digits.length > 7) {
    formatted += `-${digits.slice(7, 10)}`;
  }
  
  return formatted;
}

/**
 * Removes formatting from a phone number, keeping only digits and +
 * @param value - The formatted phone number string
 * @returns Cleaned phone number string (e.g., +15551234567)
 */
export function unformatPhoneNumber(value: string): string {
  // Remove all non-digit characters except +
  const cleaned = value.replace(/[^\d+]/g, "");
  // Ensure it starts with +
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
}
