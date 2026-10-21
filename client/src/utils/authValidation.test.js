import test from 'node:test'
import assert from 'node:assert/strict'
import { getAuthValidationError } from './authValidation.js'

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
  assert.match(getAuthValidationError({ ...validRegister, email: 'not-an-email' }), /email/i)
})

test('rejects email longer than backend limit', () => {
  const email = `${'a'.repeat(245)}@example.com`
  assert.match(getAuthValidationError({ ...validRegister, email }), /254 karakter/i)
})

test('rejects passwords shorter than eight characters', () => {
  assert.match(
    getAuthValidationError({ ...validRegister, password: 'short', confirmPassword: 'short' }),
    /8–72 karakter/i,
  )
})

test('rejects passwords longer than backend limit', () => {
  const password = 'a'.repeat(73)
  assert.match(
    getAuthValidationError({ ...validRegister, password, confirmPassword: password }),
    /8–72 karakter/i,
  )
})

test('rejects mismatched password confirmation', () => {
  assert.match(getAuthValidationError({ ...validRegister, confirmPassword: 'different123' }), /Konfirmasi/i)
})

test('rejects usernames shorter than three characters', () => {
  assert.match(getAuthValidationError({ ...validRegister, username: 'ab' }), /Username.*3–30/i)
})

test('rejects usernames longer than thirty characters', () => {
  assert.match(getAuthValidationError({ ...validRegister, username: 'a'.repeat(31) }), /Username.*3–30/i)
})

test('rejects usernames with unsupported characters', () => {
  assert.match(getAuthValidationError({ ...validRegister, username: 'user name' }), /Username/i)
})

test('accepts valid login details without registration-only fields', () => {
  assert.equal(
    getAuthValidationError({ mode: 'login', email: 'user@example.com', password: 'password123' }),
    '',
  )
})

test('rejects malformed email on login too', () => {
  assert.match(getAuthValidationError({ mode: 'login', email: 'bad', password: 'password123' }), /email/i)
})
