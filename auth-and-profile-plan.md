# Auth And Basic Profile Plan

## Decision

Use **passwordless authentication**.

Users should be able to create and access an account with either:

- Email
- Phone number

Avoid passwords for the first version.

Passwords add user friction and create extra security burden: password reset flows, password storage, credential stuffing risk, weak passwords, and account takeover support.

## Recommended Login Methods

Start with:

1. **Email magic link / one-time code**
2. **SMS one-time code**
3. **Passkeys after first account verification**

This gives users flexible login without requiring a password.

## Why Not Passkey-Only First

Passkeys are excellent, but they should not be the only first login method.

Reasons:

- Some users will be unfamiliar with passkeys.
- Account recovery is harder if passkeys are the only credential.
- Cross-device and web/mobile behavior needs careful testing.
- React Native passkey support may require native modules and a development build, not only Expo Go.

Best approach:

Use email or phone verification to create the account, then encourage the user to add a passkey as the preferred future login method.

## Signup Flow

Recommended first-release signup:

1. User chooses **Continue with email** or **Continue with phone**.
2. App sends a one-time code or magic link.
3. User verifies the code/link.
4. Backend creates the account if it does not exist.
5. User enters basic profile information.
6. App creates a long-lived session.
7. Later prompt: **Add passkey for faster login**.

## Login Flow

For returning users:

1. User chooses email, phone, or passkey.
2. If using email or phone, send a one-time code/link.
3. If using passkey, verify the WebAuthn/passkey assertion.
4. On success, issue access and refresh tokens.
5. Keep the user logged in until they log out, unless the token is revoked or suspicious activity is detected.

## Email Vs Phone

Allow both, but require only one verified identifier.

Recommended rules:

- User can sign up with email or phone.
- One of email or phone must be verified.
- User can add the other later for recovery.
- Do not allow multiple accounts with the same verified email.
- Do not allow multiple accounts with the same verified phone.

Phone login is useful for community/social apps.

Email login is useful for web access, receipts, support, and account recovery.

## One-Time Code Rules

For email and SMS one-time codes:

- Code length: 6 digits
- Expiration: 5 to 10 minutes
- Max attempts per code: 5
- Rate limit per identifier and IP/device
- Store only a hashed version of the code
- Mark code as consumed after successful use
- Do not reveal whether an email/phone already exists

Example user-facing message:

> If an account exists or can be created, we sent a code.

## Magic Link Vs Numeric Code

For mobile, numeric codes are usually simpler than magic links because users may open email links on a different device.

Recommended:

- Phone: SMS 6-digit code
- Email: 6-digit code first
- Magic links later, especially for web

## Passkeys

Use passkeys as the preferred secure login method after account verification.

Backend:

- Spring Security passkey/WebAuthn support
- Store public credentials server-side
- Never store private keys
- Allow multiple passkeys per account
- Let users remove old passkeys

Client:

- Web can use browser WebAuthn APIs.
- Native iOS/Android support needs React Native passkey integration.
- This may require moving beyond Expo Go into a development build when implemented.

## Session Strategy

The app should support long-lived sessions.

Recommended model:

- Short-lived access token
- Long-lived refresh token
- Refresh token rotation
- Store refresh token hash in backend
- Store refresh token securely on device
- Revoke refresh token on logout

Session fields:

- Session ID
- User ID
- Refresh token hash
- Device/install ID
- Platform: iOS, Android, web
- Created timestamp
- Last used timestamp
- Expires timestamp
- Revoked timestamp

Recommended lifetimes:

- Access token: 10 to 30 minutes
- Refresh token: 90 to 180 days for mobile
- Web refresh token: shorter, such as 7 to 30 days

The user experience can still feel permanent because the app refreshes access tokens silently.

## Basic Profile Info

Required after first verification:

- Display name

Automatically stored:

- User ID
- Created timestamp
- Account status
- Verified email, if email was used
- Verified phone, if phone was used

Optional:

- Profile photo
- Short bio
- City/neighborhood
- Preferred language

Do not require:

- Full legal name
- Exact address
- Date of birth
- Gender
- Government ID

## Suggested Backend Tables

Start with:

- users
- user_profiles
- user_emails
- user_phones
- auth_one_time_codes
- auth_sessions
- auth_passkeys

## Suggested API Endpoints

Authentication:

- `POST /auth/email/start`
- `POST /auth/email/verify`
- `POST /auth/phone/start`
- `POST /auth/phone/verify`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/session`

Profile:

- `GET /me`
- `PATCH /me/profile`

Passkeys:

- `POST /auth/passkeys/register/options`
- `POST /auth/passkeys/register`
- `POST /auth/passkeys/login/options`
- `POST /auth/passkeys/login`
- `GET /auth/passkeys`
- `DELETE /auth/passkeys/{id}`

## First Implementation Recommendation

Build in this order:

1. Email one-time code login
2. Basic profile creation
3. Long-lived mobile sessions
4. Phone one-time code login
5. Logout and session revocation
6. Passkey registration/login
7. Web read-only login, if needed

This lets us get a secure, usable account system working before adding the more complex passkey client integration.
