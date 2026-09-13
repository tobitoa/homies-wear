const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(req) {
  const { name, email, password } = req.body;
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return "Name must be at least 2 characters long.";
  }
  if (!email || !EMAIL_REGEX.test(email.trim())) {
    return "Please provide a valid email address.";
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  return null;
}

export function validateLogin(req) {
  const { email, password } = req.body;
  if (!email || !password) {
    return "Email and password are required.";
  }
  return null;
}
