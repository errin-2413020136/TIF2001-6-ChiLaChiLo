# Client Authentication Test Matrix

Automated tests run with `npm test` from the `client/` directory. The project uses Node.js built-in test runner, so no extra test dependency is required.

## Automated validation tests

| Case | Input | Expected result |
| --- | --- | --- |
| Valid registration | Valid username/email, 8+ character password, matching confirmation | No validation error |
| Invalid email | Email without valid address format | Email validation error |
| Short password | Password shorter than 8 characters | Password validation error |
| Password mismatch | Confirmation differs from password | Confirmation error |
| Short username | Username shorter than 2 non-whitespace characters | Username validation error |
| Valid login | Valid email and 8+ character password | No validation error |
| Invalid login email | Malformed email with otherwise valid password | Email validation error |
| Email with outer spaces | Valid email surrounded by spaces | No validation error |
| Minimum password length | Password contains exactly 8 characters | No validation error |

## Automated frontend view-state tests

The UI view model is kept in `client/src/utils/authViewModel.js`. Tests verify the display content and submit-button label for both login and registration states.

| Case | Expected result |
| --- | --- |
| Login page state | Shows login title, description, and registration switch text |
| Registration page state | Shows registration title, description, and login switch text |
| Login submit button | Shows "Masuk" when idle |
| Registration submit button | Shows "Buat akun" when idle |
| Loading state | Shows "Memproses..." for both modes |

## Manual browser checks

These checks require the frontend browser and a running backend.

- Switch between login and registration.
- Confirm username and password confirmation fields appear only during registration.
- Submit invalid data and confirm the error message appears.
- Submit while the request is pending and verify the submit button is disabled.
- Verify server/network errors are shown in the form.
- Verify successful registration returns to login.
- Verify a login response containing a token stores `auth_token` in localStorage.

## CI

GitHub Actions runs ESLint, the automated test suite, and the production build for frontend changes. The browser/API scenarios above remain manual integration checks because this repository does not currently include a browser automation runner or a backend test environment in this frontend task.
