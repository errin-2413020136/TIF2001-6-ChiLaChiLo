# User Guide — ChiLaChiLo Authentication

## Run the web client

1. Install Node.js 22 or a compatible version required by the project's Vite toolchain.
2. Open a terminal in the `client/` directory.
3. Install locked dependencies with `npm ci`.
4. Start the development server with `npm run dev`.
5. Ensure the backend is running. To use a different API address, define `VITE_API_BASE_URL` before starting Vite. The default is `http://localhost:3000/api`.

## Register

1. Select **Daftar sekarang**.
2. Enter a username (at least 2 characters), a valid email address, a password (at least 8 characters), and the same password in the confirmation field.
3. Select **Buat akun**.
4. If registration succeeds, the UI returns to the login form. If the server rejects the request or cannot be reached, an error message is displayed.

## Login

1. Enter the email and password registered with the backend.
2. Select **Masuk**.
3. When the response includes a `token`, the client saves it as `auth_token` in localStorage. A server response without a token is not proof that a session was established.

## Validation and troubleshooting

- Email must have a valid basic format.
- Password must have at least 8 characters.
- Registration confirmation must exactly match the password.
- If the server cannot be reached, check that the backend is running and that `VITE_API_BASE_URL` points to the correct API base.
- UI validation does not replace backend validation.

## Verification commands

From `client/`, run `npm run lint`, `npm test`, and `npm run build`. GitHub Actions runs these checks for relevant pushes and pull requests.
