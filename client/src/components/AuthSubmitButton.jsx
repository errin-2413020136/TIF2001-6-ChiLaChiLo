function AuthSubmitButton({ loading, isRegister }) {
  return (
    <button className="submit-button" type="submit" disabled={loading}>
      {loading ? 'Memproses...' : isRegister ? 'Buat akun' : 'Masuk'}
    </button>
  )
}

export default AuthSubmitButton
