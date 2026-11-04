# UI Component Catalog — Authentication

Scope: React web client in `client/`.

## Reusable components

### `AuthField`

Location: `client/src/components/AuthField.jsx`

Props:
- `id`, `name`, `label`: stable input identifiers and visible label.
- `type`, `autoComplete`, `placeholder`: native input configuration.
- `value`, `onChange`: controlled input state.
- `required`, `minLength`: browser input constraints.

Use this component for username, email, password, and password confirmation fields.

### `AuthSubmitButton`

Location: `client/src/components/AuthSubmitButton.jsx`

Props:
- `loading`: disables the button while the request is in progress and changes its label.
- `isRegister`: selects the register or login button label.

## Validation rules

Centralized in `client/src/utils/authValidation.js`:
1. Registration username must contain at least 2 non-whitespace characters.
2. Email must match a basic address pattern and cannot contain whitespace.
3. Password must contain at least 8 characters.
4. Registration password confirmation must match the password exactly.
5. Login uses email and password rules; username and confirmation are registration-only.

The browser's native `required`, `type=email`, and `minLength` constraints provide an additional layer. Server-side validation remains required; client-side validation is not a security boundary.

## API service

`client/src/services/api.js` owns HTTP requests. Set `VITE_API_BASE_URL` to the backend API base URL; its current default is `http://localhost:3000/api`. The service calls `POST /auth/register` and `POST /auth/login`.
