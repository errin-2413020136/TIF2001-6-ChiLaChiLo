export function getAuthPageContent(page) {
  const isRegister = page === 'register'

  return {
    isRegister,
    eyebrow: isRegister ? 'BUAT AKUN' : 'AKUN KAMU',
    title: isRegister ? 'Daftar akun' : 'Masuk ke akun',
    description: isRegister
      ? 'Isi data berikut untuk membuat akun baru.'
      : 'Masukkan email dan kata sandi kamu.',
    switchPrompt: isRegister ? 'Sudah punya akun?' : 'Belum punya akun?',
    switchLabel: isRegister ? 'Masuk' : 'Daftar sekarang',
  }
}

export function getAuthSubmitLabel({ loading, isRegister }) {
  if (loading) return 'Memproses...'
  return isRegister ? 'Buat akun' : 'Masuk'
}
