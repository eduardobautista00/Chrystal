export function phoneValidator(phone) {
  // Regular expression for validating Philippine phone numbers
  const PHILIPPINE_PHONE_REGEX = /^\+63[ -]?(9\d{2}[ -]?\d{3}[ -]?\d{4}|2[ -]?\d{3}[ -]?\d{4}|(?:0[2-9]\d{2}|[1-9]\d{1,2})[ -]?\d{3}[ -]?\d{4})$/;

  if (!phone) return "Please fill in this field."; // Check for empty input
  if (!PHILIPPINE_PHONE_REGEX.test(phone)) return "Enter a valid phone number."; // Check format

  return ""; // Return an empty string if validation passes
}
