# Client Authentication Test Matrix

Automated tests: `client/src/utils/authValidation.test.js`, run with `npm test` from `client/`.

| Case | Input | Expected result |
| --- | --- | --- |
| Valid registration | Valid username/email, 8+ character password, matching confirmation | No validation error |
| Invalid email | Email without valid address format | Email validation error |
| Short password | Password shorter than 8 characters | Password validation error |
| Password mismatch | Confirmation differs from password | Confirmation error |
| Short username | Username shorter than 2 non-whitespace characters | Username validation error |
| Valid login | Valid email and 8+ character password | No validation error |
| Invalid login email | Malformed email with otherwise valid password | Email validation error |

## Additional manual UI checks

- Switch between login and registration.
- Confirm the registration-only fields appear only on registration.
- Submit while the request is pending and verify the submit button is disabled.
- Verify server/network errors are shown in the form.
- Verify successful registration returns to login.
- Verify a login response containing a token stores `auth_token` in localStorage.

The automated suite covers the pure validation function. The UI/API scenarios above remain manual integration checks until a browser test runner and running backend are available.
