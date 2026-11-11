# Backend API

## Requirements
- Node.js 18 or newer
- PostgreSQL database (Neon/Supabase free tier or local PostgreSQL)

## Setup
1. From this directory, copy `.env.example` to `.env`.
2. Fill in `DATABASE_URL` and a random `JWT_SECRET` with at least 32 characters. Never commit `.env`.
3. Install dependencies: `npm install`.
4. Apply `../docs/database_schema.sql` to PostgreSQL. The schema creates users, branches, products, ingredients, shifts, sales, sale items, and stock movement history, including initial demo inventory.
5. Start the API: `npm run dev`.
6. Check `GET http://localhost:5000/api/v1/health`.

## API
Base path: `/api/v1`. Register and login are public. Inventory, stock adjustment, sales, branch, and shift endpoints require `Authorization: Bearer <jwt>`.

See [../docs/api_specifications.md](../docs/api_specifications.md) for request/response examples and status codes. See [../docs/database_schema.md](../docs/database_schema.md) for ERD and data dictionary.

## Useful checks
```bash
npm run lint
npm test
npm run test:coverage
npm run test:db
``

Operational API defaults to Cabang Nganjuk. Other branches can be selected using `branchId` where documented. The current branch/role access model is a baseline and must be expanded before production use.

Never paste connection strings, passwords, or JWT secrets into issues or pull requests.
