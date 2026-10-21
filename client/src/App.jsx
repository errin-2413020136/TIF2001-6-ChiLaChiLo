import { useState } from 'react'
import { loginUser, registerUser } from './services/api'
import './App.css'

function App() {
  const [page, setPage] = useState('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const isRegister = page === 'register'

  function changePage(nextPage) {
    setPage(nextPage)
    setMessage('')
    setPassword('')
    setConfirmPassword('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (isRegister && password !== confirmPassword) {
      setMessageType('error')
      setMessage('Konfirmasi kata sandi belum sama.')
      return
    }

    if (password.length < 8) {
      setMessageType('error')
      setMessage('Kata sandi harus memiliki minimal 8 karakter.')
      return
    }

    setLoading(true)

    try {
      if (isRegister) {
        await registerUser(name.trim(), email.trim(), password)
        setMessageType('success')
        setMessage('Pendaftaran berhasil. Silakan masuk menggunakan akun kamu.')
        setPage('login')
        setName('')
        setPassword('')
        setConfirmPassword('')
      } else {
        const result = await loginUser(email.trim(), password)
        if (result.token) {
          localStorage.setItem('auth_token', result.token)
        }
        setMessageType('success')
        setMessage(result.message || 'Login berhasil.')
      }
    } catch (error) {
      setMessageType('error')
      setMessage(error.message || 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-intro" aria-label="Tentang ChiLaChiLo">
        <div className="brand">
          <span className="brand-mark">C</span>
          <span>ChiLaChiLo</span>
        </div>
        <div className="intro-content">
          <p className="eyebrow">PROYEK SOFTDEV</p>
          <h1>Selamat datang di ChiLaChiLo.</h1>
          <p className="intro-description">
            Masuk atau buat akun untuk melanjutkan ke layanan ChiLaChiLo.
          </p>
        </div>
        <p className="intro-footer">Aplikasi web berbasis React.js</p>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="mobile-brand">
            <span className="brand-mark">C</span>
            <span>ChiLaChiLo</span>
          </div>
          <p className="eyebrow">{isRegister ? 'BUAT AKUN' : 'AKUN KAMU'}</p>
          <h2>{isRegister ? 'Daftar akun' : 'Masuk ke akun'}</h2>
          <p className="form-description">
            {isRegister
              ? 'Isi data berikut untuk membuat akun baru.'
              : 'Masukkan email dan kata sandi kamu.'}
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && (
              <div className="form-field">
                <label htmlFor="name">Nama lengkap</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  minLength={2}
                />
              </div>
            )}

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Kata sandi</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
              />
            </div>

            {isRegister && (
              <div className="form-field">
                <label htmlFor="confirm-password">Konfirmasi kata sandi</label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Ulangi kata sandi"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  minLength={8}
                />
              </div>
            )}

            {message && (
              <div className={`form-message ${messageType}`} role="status">
                {message}
              </div>
            )}

            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? 'Memproses...' : isRegister ? 'Buat akun' : 'Masuk'}
            </button>
          </form>

          <p className="switch-page">
            {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
            <button
              className="text-button"
              type="button"
              onClick={() => changePage(isRegister ? 'login' : 'register')}
            >
              {isRegister ? 'Masuk' : 'Daftar sekarang'}
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
