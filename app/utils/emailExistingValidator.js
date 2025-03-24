export function emailExistingValidator(email) {
  const trimmedEmail = email.trim();
  
  if (!trimmedEmail) {
    return "Please fill in this field.";
  }
  
  // Add your logic here to check if the email already exists
  // For example, you might want to call an API to verify the email

  // Update the return statement for user not found
  return "Email or user not found.";
}