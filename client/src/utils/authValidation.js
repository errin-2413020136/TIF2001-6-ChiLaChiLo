const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]{3,30}$/

export function getAuthValidationError({
  mode,
  username = '',
  email = '',
  password = '',
  confirmPassword = '',
}) {
  if (mode === 'register' && !USERNAME_PATTERN.test(username.trim())) {
    return 'Username harus 3–30 karakter dan hanya boleh berisi huruf, angka, titik, garis bawah, atau tanda hubung.'
  }

  const normalizedEmail = email.trim()
  if (normalizedEmail.length > 254 || !EMAIL_PATTERN.test(normalizedEmail)) {
    return 'Masukkan alamat email yang valid dengan maksimal 254 karakter.'
  }

  if (password.length < 8 || password.length > 72) {
    return 'Kata sandi harus memiliki panjang 8–72 karakter.'
  }

  if (mode === 'register' && password !== confirmPassword) {
    return 'Konfirmasi kata sandi belum sama.'
  }

  return ''
}
