# Backend API

## Requirements
- Node.js 18 or newer
- PostgreSQL database (Neon/Supabase free tier or local PostgreSQL)

## Setup
1. From this directory, copy `.env.example` to `.env`.
2. Fill in `DATABASE_URL` using your PostgreSQL provider's connection URI and set a random `JWT_SECRET` with at least 32 characters. Never commit `.env`.
3. Install dependencies: `npm install`.
4. Apply `../docs/database_schema.sql` to the configured database.
5. Start in development: `npm run dev`, or production-style: `npm start`.

The API listens on `PORT` (default 5000). Base path: `/api/v1`. Endpoint contract: [../docs/api_specifications.md](../docs/api_specifications.md).

## Useful checks
- `GET http://localhost:5000/api/v1/health` checks API and database availability.
- `npm run test:db` verifies the PostgreSQL connection.

Do not paste connection strings, passwords, or JWT secrets into issues or pull requests.
