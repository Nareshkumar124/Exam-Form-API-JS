function isStrongPassword(password) {
    // Define the criteria for a strong password
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Check if the password meets all criteria
    const isStrong =
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasDigit &&
        hasSpecialChar;

    // Return true if the password is strong, otherwise false
    return isStrong;
}

function validateAUID(auid) {
    // Replace the pattern with the specific format for your university AUID
    const pattern = /^[0-9]{9}$/;

    // Test the AUID against the pattern
    const isMatch = pattern.test(auid);

    // Return true if the match is found, otherwise false
    return isMatch;
}

function validatePhoneNumber(phoneNumber) {
    // Define the regular expression for a 10-digit Indian phone number
    const pattern = /^\d{10}$/;

    // Test the phone number against the pattern
    const isMatch = pattern.test(phoneNumber);

    // Return true if the match is found, otherwise false
    return isMatch;
}

function isEmailValid(email) {
    // Basic pattern for email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Check if the email matches the pattern
    return emailRegex.test(email);
  }
export {
    validateAUID,
    validatePhoneNumber,
    isStrongPassword,
    isEmailValid,
}
