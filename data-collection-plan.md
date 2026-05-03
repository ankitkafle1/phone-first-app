# Data Collection Plan

## Product Context

The app is a phone-first community app for:

- Connecting people
- Displaying notices
- Basic buy/sell posts
- Text and image content
- Long-lived login sessions unless the user logs out

Because this app will store user information and user-generated content, we should collect only what is needed for trust, safety, account recovery, and core functionality.

## Data Collection Principle

Collect the minimum data needed to make the app useful and safe.

Do not collect sensitive information unless a feature clearly requires it.

## Required At Signup

Start with:

- **Phone number or email address**
- **Password or passwordless login method**
- **Display name**
- **Accepted terms/privacy policy timestamp**

Recommended default:

Use **phone number as the primary login identifier** if the app is community/local/social oriented.

Use **email as the primary login identifier** if the app is more marketplace/content oriented.

Possible compromise:

- Require one login identifier: phone or email
- Allow the other to be added later for account recovery

## Profile Information

Required:

- **User ID**
- **Display name**
- **Account creation date**
- **Account status**

Optional:

- Profile photo
- Short bio
- City or neighborhood
- Preferred language
- Public contact preference

Avoid requiring:

- Full legal name
- Exact address
- Date of birth
- Gender
- Government ID
- Employer

These can create privacy and moderation burden before the product needs them.

## Login And Session Data

Because sessions may be long-lived, collect and store:

- User ID
- Session ID
- Refresh token hash
- Access token expiry
- Device ID or installation ID
- Device name, if available
- Platform: iOS, Android, web
- Created timestamp
- Last used timestamp
- Logout/revoked timestamp

Do not store raw refresh tokens. Store only hashed tokens server-side.

Recommended session behavior:

- Short-lived access token
- Long-lived refresh token
- Refresh token rotation
- Ability to log out from current device
- Later: ability to view and revoke other logged-in devices

## Content Data

For text and image content, store:

- Content ID
- Author user ID
- Content type: notice, post, listing, message, comment
- Text body
- Image URLs
- Created timestamp
- Updated timestamp
- Visibility: public, community, private, draft
- Moderation status: active, pending, hidden, removed

For images, store:

- Storage object key
- Public or signed URL strategy
- Uploaded by user ID
- File size
- MIME type
- Width and height, if available
- Created timestamp

Avoid storing unnecessary image metadata such as GPS EXIF data. Strip EXIF metadata before making images public.

## Buy/Sell Listings

For basic buy/sell posts, collect:

- Listing title
- Description
- Category
- Price
- Currency
- Condition
- Images
- General location, such as city or neighborhood
- Seller user ID
- Listing status: active, sold, paused, removed
- Created and updated timestamps

Avoid collecting payment information at first.

If payments are added later, use a payment provider and avoid storing card or bank details directly.

## Notices

For notices, collect:

- Notice title
- Notice body
- Author user ID
- Audience or community
- Start date
- End date, if applicable
- Pinned status
- Created and updated timestamps

## Messaging Or Contact

If the app supports direct messaging, store:

- Conversation ID
- Participant user IDs
- Message ID
- Sender user ID
- Message body
- Image attachments, if allowed
- Created timestamp
- Read timestamp, if needed
- Moderation/report status

Important:

Private messages are still user content and may need safety/reporting tools.

## Trust And Safety

Collect enough data to handle abuse reports:

- Report ID
- Reporter user ID
- Reported user ID, content ID, or listing ID
- Report reason
- Optional report details
- Created timestamp
- Review status
- Moderator notes

Also track:

- Blocked users
- Hidden content
- Account warnings
- Account suspension status

## Location

Recommended for now:

- Use **general location only**, such as city, neighborhood, or manually selected area.

Avoid for now:

- Continuous location tracking
- Precise GPS location
- Background location

Precise location should only be added if a future feature truly needs it.

## Analytics

Start with minimal product analytics:

- App opens
- Signup completed
- Login completed
- Post created
- Listing created
- Notice viewed
- Search used

Avoid collecting:

- Full text content into analytics tools
- Personal profile fields into analytics tools
- Precise location into analytics tools

## Web Version

Because web is a limited secondary access path, web sessions can be more restricted.

Recommended:

- Allow login on web only if needed.
- Consider making web read-only at first.
- If web login is enabled, use shorter session duration than mobile.
- Do not let web limitations weaken mobile functionality.

## Privacy And Store Disclosure Notes

Apple and Google require disclosure of data collected by the app and by third-party SDKs.

Likely disclosure categories:

- Contact info: email or phone number
- User content: text, images, messages, listings
- Identifiers: user ID, device/session identifiers
- Usage data: basic app interactions
- Diagnostics: crash logs, performance data, if collected

Keep the disclosure easier by avoiding:

- Advertising tracking
- Data broker sharing
- Precise location
- Contacts upload
- Payment data storage
- Sensitive personal data

## Recommended Initial Data Model

Start with these backend tables:

- users
- user_profiles
- auth_sessions
- posts
- listings
- notices
- media_assets
- reports
- blocked_users

Add messaging tables only when messaging becomes part of the first release:

- conversations
- conversation_participants
- messages

## First Release Recommendation

Collect:

- Email or phone
- Display name
- Password/passwordless auth data
- Basic profile data
- User posts/notices/listings
- Uploaded images
- General location only if needed for discovery
- Session/device metadata for long login
- Reports and blocks for safety

Do not collect yet:

- Exact address
- Precise GPS location
- Contacts
- Payment card or bank details
- Government ID
- Full legal name
- Date of birth, unless age restrictions become necessary
- Advertising identifiers

This keeps the first version useful while reducing privacy risk, compliance work, and backend complexity.
