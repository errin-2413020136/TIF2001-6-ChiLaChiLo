import { useState } from 'react'
import AuthField from './components/AuthField'
import AuthSubmitButton from './components/AuthSubmitButton'
import { getAuthValidationError } from './utils/authValidation'
import { loginUser, registerUser } from './services/api'
import './App.css'

function App() {
  const [page, setPage] = useState('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')
  const [username, setUsername] = useState('')
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

    const validationError = getAuthValidationError({
      mode: page,
      username,
      email,
      password,
      confirmPassword,
    })

    if (validationError) {
      setMessageType('error')
      setMessage(validationError)
      return
    }

    setLoading(true)
    try {
      if (isRegister) {
        await registerUser(username.trim(), email.trim(), password)
        setMessageType('success')
        setMessage('Pendaftaran berhasil. Silakan masuk menggunakan akun kamu.')
        setPage('login')
        setUsername('')
        setPassword('')
        setConfirmPassword('')
      } else {
        const result = await loginUser(email.trim(), password)
        if (result.token) localStorage.setItem('auth_token', result.token)
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

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {isRegister && (
              <AuthField
                id="username"
                name="username"
                label="Username"
                type="text"
                autoComplete="username"
                placeholder="Buat username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                minLength={3}
                maxLength={30}
              />
            )}

            <AuthField
              id="email"
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              maxLength={254}
            />

            <AuthField
              id="password"
              name="password"
              label="Kata sandi"
              type="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              maxLength={72}
            />

            {isRegister && (
              <AuthField
                id="confirm-password"
                name="confirmPassword"
                label="Konfirmasi kata sandi"
                type="password"
                autoComplete="new-password"
                placeholder="Ulangi kata sandi"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={8}
                maxLength={72}
              />
            )}

            {message && (
              <div className={`form-message ${messageType}`} role="status" aria-live="polite">
                {message}
              </div>
            )}

            <AuthSubmitButton loading={loading} isRegister={isRegister} />
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
