export function emailValidator(email) {
  const trimmedEmail = email.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!trimmedEmail) {
    return "Please fill in this field.";
  }
  if (!re.test(trimmedEmail)) {
    return "Please enter a valid email address!";
  }
  
  return "";
}
