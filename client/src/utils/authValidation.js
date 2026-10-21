const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function getAuthValidationError({
  mode,
  username = '',
  email = '',
  password = '',
  confirmPassword = '',
}) {
  if (mode === 'register' && username.trim().length < 2) {
    return 'Username harus memiliki minimal 2 karakter.'
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    return 'Masukkan alamat email dengan format yang valid.'
  }

  if (password.length < 8) {
    return 'Kata sandi harus memiliki minimal 8 karakter.'
  }

  if (mode === 'register' && password !== confirmPassword) {
    return 'Konfirmasi kata sandi belum sama.'
  }

  return ''
}
