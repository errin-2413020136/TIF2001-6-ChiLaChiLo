# Backend testing guide

## Tools

- Jest: unit test runner.
- ESLint: checks code quality and common JavaScript mistakes.
- PostgreSQL: database used by the REST API.

## Run locally

From the repository root:

```bash
cd server
npm install
npm run lint
npm test
npm run test:coverage
```

The unit tests mock the database connection and do not need a live PostgreSQL server. They verify registration input validation, password hashing flow, duplicate-account handling, invalid login credentials, and JWT middleware behavior.

## Database setup and runtime checks

1. Copy `.env.example` to `.env`.
2. Configure `DATABASE_URL` with a PostgreSQL connection URI.
3. Set `JWT_SECRET` to a random value with at least 32 characters.
4. Apply `docs/database_schema.sql` to the configured database.
5. Run `npm run test:db` and then `npm run dev`.
6. Call `GET /api/v1/health` and verify the response reports `database: connected`.

Never commit the real `.env` file or share database credentials in Issues or Pull Requests.

## Test matrix

| Area | Scenario | Expected result |
|---|---|---|
| Registration validation | Valid username, email, password | Accepted |
| Registration validation | Username too short / invalid characters | HTTP 400 |
| Registration validation | Invalid email | HTTP 400 |
| Registration validation | Password shorter than 8 or longer than 72 characters | HTTP 400 |
| Registration | JWT secret missing | HTTP 500; no user insert |
| Registration | Username/email duplicate | HTTP 409 |
| Registration | Valid data | HTTP 201; password stored as bcrypt hash |
| Login | Unknown account or wrong password | HTTP 401 |
| JWT middleware | Missing Bearer token | HTTP 401 |
| JWT middleware | Valid token with correct issuer | Continue to next handler |
| Database health | PostgreSQL available | HTTP 200 |
| Database health | PostgreSQL unavailable | HTTP 503 |

## CI

GitHub Actions runs backend dependency installation, ESLint, Jest, and JavaScript syntax checks on pull requests that change the client, server, docs, or workflow. CI unit tests mock PostgreSQL; they do not replace a separate runtime test against a configured PostgreSQL instance.
