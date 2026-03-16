/**
 * Maximum digits in an E.164 phone number (country code + national number).
 */
const MAX_DIGITS = 15;

/**
 * Formats a phone number for display, supporting international dialing codes (1–3 digits).
 * - NANP (+1): +1 (xxx) xxx-xxxx
 * - Other: +XXX XXX XXX XXXX... (country code 1–3 digits, then groups of 3)
 * @param value - The phone number string to format (digits and optional leading +)
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/[^\d+]/g, "");
  const digits = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;
  const limited = digits.slice(0, MAX_DIGITS);

  if (limited.length === 0) return "";

  // NANP: +1 followed by 10 digits → +1 (xxx) xxx-xxxx
  if (limited.startsWith("1") && limited.length === 11) {
    const rest = limited.slice(1);
    return `+1 (${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6)}`;
  }
  if (limited.startsWith("1") && limited.length <= 10) {
    const rest = limited.slice(1);
    let formatted = "+1";
    if (rest.length > 0) formatted += ` (${rest.slice(0, 3)}`;
    if (rest.length >= 3) formatted += ")";
    if (rest.length > 3) formatted += ` ${rest.slice(3, 6)}`;
    if (rest.length > 6) formatted += `-${rest.slice(6, 10)}`;
    return formatted;
  }

  // International: country code 1–3 digits, then space-separated groups of 3
  const len = limited.length;
  let countryEnd = 1;
  if (len >= 3) countryEnd = 3;
  else if (len >= 2) countryEnd = 2;

  const country = limited.slice(0, countryEnd);
  const rest = limited.slice(countryEnd);
  let formatted = `+${country}`;
  for (let i = 0; i < rest.length; i += 3) {
    formatted += " " + rest.slice(i, i + 3);
  }
  return formatted.trim();
}

/**
 * Removes formatting from a phone number, keeping only digits and a leading +.
 * @param value - The formatted phone number string
 * @returns Cleaned phone number string (e.g., +15551234567 or +2348012345678)
 */
export function unformatPhoneNumber(value: string): string {
  const cleaned = value.replace(/[^\d+]/g, "");
  return cleaned.startsWith("+") ? cleaned : cleaned ? `+${cleaned}` : "";
}
