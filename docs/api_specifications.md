# REST API specifications

Base URL for local development: `http://localhost:5000/api/v1`. All request and response bodies are JSON. Send `Content-Type: application/json` for JSON request bodies. The API currently implements authentication and a health check.

## Endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | None | Check API and database connectivity |
| POST | `/auth/register` | None | Create a user, hash password, and return a JWT |
| POST | `/auth/login` | None | Verify credentials and return a JWT |
| GET | `/auth/me` | Bearer JWT | Return the authenticated user's profile |

## POST /auth/register

Request:
```json
{ "username": "student_01", "email": "student@example.com", "password": "strong-password" }
```

Rules: username must match `^[a-zA-Z0-9_.-]{3,30}$`; email must be valid and at most 254 characters; password must be 8–72 characters. Email is normalized to lowercase. Password is hashed with bcrypt before it is persisted.

Success (201):
```json
{
  "message": "Registrasi berhasil.",
  "token": "<jwt>",
  "user": { "id": "1", "username": "student_01", "email": "student@example.com", "role": "user", "created_at": "..." }
}
```

Errors: `400` invalid input or JSON; `409` username/email already exists; `500` unexpected server/configuration error.

## POST /auth/login

Request:
```json
{ "identifier": "student@example.com", "password": "strong-password" }
```

`identifier` may be the username or email. For compatibility, `email` or `username` may be sent instead of `identifier`.

Success (200):
```json
{
  "message": "Login berhasil.",
  "token": "<jwt>",
  "user": { "id": "1", "username": "student_01", "email": "student@example.com", "role": "user", "created_at": "..." }
}
```

Errors: `400` missing/invalid fields; `401` invalid credentials; `500` unexpected server/configuration error. The same 401 response is used for unknown users and incorrect passwords.

## GET /auth/me

Header: `Authorization: Bearer <jwt>`

Success (200): `{ "user": { "id": "1", "username": "student_01", "email": "student@example.com", "role": "user", "created_at": "..." } }`

Errors: `401` missing, invalid, or expired token; `404` user no longer exists; `500` unexpected server error.

## GET /health

Success (200): `{ "status": "ok", "database": "connected" }`. If the database is unreachable, returns `503` with `{ "status": "error", "database": "unavailable" }`.

## Security and operational notes

- JWTs are signed using `JWT_SECRET`, include the `sub` and `role` claims, expire after `JWT_EXPIRES_IN` (default one hour), and specify issuer `softdev-api`.
- Use a random secret of at least 32 characters in local/deployment secrets; never commit real secrets.
- Database statements use parameterized queries.
- Input is trimmed/validated on the server. Request JSON is limited to 10 KB.
- Current API has authentication and a role claim; role-specific protected business routes must enforce authorization with the exported `requireRole(...roles)` middleware when those routes are added.
- No pagination/filter query parameters are currently needed by the authentication endpoints.
