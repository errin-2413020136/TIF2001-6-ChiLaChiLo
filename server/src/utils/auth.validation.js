const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]{3,30}$/;
const EMAIL_PATTERN = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateRegistration(input = {}) {
  const username = normalizeString(input.username);
  const email = normalizeString(input.email).toLowerCase();
  const password = typeof input.password === "string" ? input.password : "";

  if (!USERNAME_PATTERN.test(username)) {
    return { valid: false, message: "Username harus 3–30 karakter dan hanya boleh berisi huruf, angka, titik, garis bawah, atau tanda hubung." };
  }
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { valid: false, message: "Format email tidak valid." };
  }
  if (password.length < 8 || password.length > 72) {
    return { valid: false, message: "Password harus 8–72 karakter." };
  }

  return { valid: true, data: { username, email, password } };
}

module.exports = { normalizeString, validateRegistration };
