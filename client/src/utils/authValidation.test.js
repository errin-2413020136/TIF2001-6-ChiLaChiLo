import test from 'node:test'
import assert from 'node:assert/strict'
import { getAuthValidationError } from './authValidation.js'
import { getAuthPageContent, getAuthSubmitLabel } from './authViewModel.js'

const validRegister = {
  mode: 'register',
  username: 'griseldi',
  email: 'user@example.com',
  password: 'password123',
  confirmPassword: 'password123',
}

test('accepts valid registration details', () => {
  assert.equal(getAuthValidationError(validRegister), '')
})

test('rejects malformed email addresses', () => {
  assert.match(
    getAuthValidationError({ ...validRegister, email: 'not-an-email' }),
    /email/i,
  )
})

test('rejects passwords shorter than eight characters', () => {
  assert.match(
    getAuthValidationError({ ...validRegister, password: 'short', confirmPassword: 'short' }),
    /8 karakter/i,
  )
})

test('rejects mismatched password confirmation', () => {
  assert.match(
    getAuthValidationError({ ...validRegister, confirmPassword: 'different123' }),
    /Konfirmasi/i,
  )
})

test('rejects usernames shorter than two non-whitespace characters', () => {
  assert.match(
    getAuthValidationError({ ...validRegister, username: '  ' }),
    /Username/i,
  )
})

test('accepts valid login details without registration-only fields', () => {
  assert.equal(
    getAuthValidationError({
      mode: 'login',
      email: 'user@example.com',
      password: 'password123',
    }),
    '',
  )
})

test('rejects malformed email on login too', () => {
  assert.match(
    getAuthValidationError({ mode: 'login', email: 'bad', password: 'password123' }),
    /email/i,
  )
})

test('trims email whitespace before checking its format', () => {
  assert.equal(
    getAuthValidationError({ mode: 'login', email: ' user@example.com ', password: 'password123' }),
    '',
  )
})

test('accepts a password with exactly eight characters', () => {
  assert.equal(
    getAuthValidationError({ mode: 'login', email: 'user@example.com', password: '12345678' }),
    '',
  )
})

test('returns login page copy and switch action', () => {
  assert.deepEqual(getAuthPageContent('login'), {
    isRegister: false,
    eyebrow: 'AKUN KAMU',
    title: 'Masuk ke akun',
    description: 'Masukkan email dan kata sandi kamu.',
    switchPrompt: 'Belum punya akun?',
    switchLabel: 'Daftar sekarang',
  })
})

test('returns registration page copy and switch action', () => {
  assert.deepEqual(getAuthPageContent('register'), {
    isRegister: true,
    eyebrow: 'BUAT AKUN',
    title: 'Daftar akun',
    description: 'Isi data berikut untuk membuat akun baru.',
    switchPrompt: 'Sudah punya akun?',
    switchLabel: 'Masuk',
  })
})

test('shows submit label based on loading and form mode', () => {
  assert.equal(getAuthSubmitLabel({ loading: false, isRegister: false }), 'Masuk')
  assert.equal(getAuthSubmitLabel({ loading: false, isRegister: true }), 'Buat akun')
  assert.equal(getAuthSubmitLabel({ loading: true, isRegister: false }), 'Memproses...')
  assert.equal(getAuthSubmitLabel({ loading: true, isRegister: true }), 'Memproses...')
})
