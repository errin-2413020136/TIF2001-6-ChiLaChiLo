# REST API specifications — ChiLa-Chillo

Base URL: `http://localhost:5000/api/v1`. All request/response bodies use JSON. Send `Content-Type: application/json` for JSON bodies. Operational endpoints require `Authorization: Bearer <jwt>`.

## Authentication

### POST `/auth/register`
Request: `{ "username": "kasir01", "email": "kasir@example.com", "password": "strong-password" }`

Success `201`: `{ "message": "...", "token": "<jwt>", "user": { "id": 1, "username": "...", "email": "...", "role": "user" } }`.

Errors: `400` invalid input, `409` username/email already used, `500` server configuration error.

### POST `/auth/login`
Request: `{ "identifier": "kasir@example.com", "password": "strong-password" }`. Identifier accepts username or email.

Success `200`: JWT and user profile. Errors: `400` invalid request, `401` invalid credentials, `500` server error.

### GET `/auth/me`
Requires Bearer JWT. Returns the current user profile. Errors: `401` invalid/missing/expired token, `404` user not found.

## Health

### GET `/health`
Checks PostgreSQL connectivity. Returns `200` when connected or `503` when unavailable.

## Operational endpoints (JWT required)

All operational data defaults to the seeded `Cabang Nganjuk` branch. Pass `?branchId=<id>` to select another branch where supported. The authenticated user's ID is recorded for stock changes and sales.

### GET `/products`
Returns active food/menu products.

Success: `{ "items": [{ "id": 1, "name": "Large", "price": 20000, "stock": 15, "unit": "Porsi" }] }`.

### GET `/ingredients`
Returns raw materials with current and minimum stock.

Success: `{ "items": [{ "id": 1, "name": "Tepung tapioka", "stock": 25, "minimum": 10, "unit": "kg", "needs_restock": false }] }`.

### PATCH `/products/:id/stock` and PATCH `/ingredients/:id/stock`
Request: `{ "stock": 20, "note": "Restok mingguan", "branchId": 1 }`. `branchId` is optional for the default branch; note is optional and max 500 characters. Product stock must be an integer; ingredient stock may be decimal. The update and stock movement history are committed in one SQL transaction.

Errors: `400` invalid quantity/note/id, `404` branch/item not found, `500` server error.

### POST `/sales`
Creates a POS transaction and decreases product stock atomically. The backend locks product rows, rejects insufficient stock, inserts the sale and its lines, and records stock movements. An active shift must exist for the selected branch.

Request:
```json
{
  "branchId": 1,
  "paymentMethod": "cash",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 2, "quantity": 1 }
  ]
}
```

Payment methods: `cash`, `qris`, `transfer`, `other`. Quantity must be an integer from 1 to 1000. A product may appear only once per request. Success `201`: sale summary and item details.

Errors: `400` invalid cart/payment method, `404` branch/product not found, `409` no active shift or insufficient stock, `500` server error. A failed checkout rolls back all stock and transaction writes.

### GET `/sales`
Returns latest sales for the selected branch. Optional `limit` is clamped to 1–100 (default 50). Response includes order code, payment method, total, timestamp, shift name, and item summary.

### GET `/branches`
Returns branch ID, name, manager, and status.

### GET `/branches/:id/summary`
Returns branch sales total, quantity sold, and transaction count.

### GET `/shifts`
Returns recent shifts for the selected branch (latest 30).

### POST `/shifts/open`
Request: `{ "branchId": 1, "name": "Shift Siang" }`. Branch ID is optional for the default branch and name defaults to `Shift Siang`. Returns `201`; returns `409` if a shift is already active.

### PATCH `/shifts/active/close`
Request: `{ "branchId": 1 }` (optional for default branch). Closes the active shift and records the authenticated user. Returns `409` when no active shift exists.

### GET `/stock-movements`
Returns stock adjustment and sale history for the selected branch. Optional `limit` is clamped to 1–100 (default 50).

## Database and security

- PostgreSQL DDL: [database_schema.sql](./database_schema.sql); data dictionary: [database_schema.md](./database_schema.md).
- Passwords are hashed with bcrypt; JWT uses `JWT_SECRET` (minimum 32 characters), issuer `softdev-api`, and expiry `JWT_EXPIRES_IN` (default `1h`).
- SQL statements use parameterized values. Dynamic table/column names in stock adjustment are selected only from fixed server-side allowlists.
- Checkout and stock adjustment use PostgreSQL transactions and row locks.
- Never commit `.env`, database connection strings, or production secrets.
- The current operational endpoints use the default branch unless a branch ID is supplied. Role-specific authorization and branch-level user permissions remain future work; JWT authentication currently identifies the caller but does not yet scope users to assigned branches.
