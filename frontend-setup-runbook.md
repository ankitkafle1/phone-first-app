# Frontend Setup Runbook

This document records the frontend setup actions taken and the commands to recreate or continue the Expo app setup.

## Goal

Create a **phone-first React Native app** using Expo, with iOS and Android as the primary targets and web as a limited secondary access path.

## Created Project

Frontend directory:

```sh
/Users/ankit/Apps/frontend
```

Main stack:

- React Native
- Expo SDK 54
- Expo Router
- TypeScript
- React Native Web

## Preferred Create Command

For a clean new project that matches the current Expo Go version on the test phone, use Expo SDK 54:

```sh
npx create-expo-app@latest frontend --template default@sdk-54
```

Then enter the project:

```sh
cd frontend
```

If you want to create another app with a different folder name:

```sh
npx create-expo-app@latest my-app-name --template default@sdk-54
cd my-app-name
```

## Manual Setup Used In This Workspace

The generator stalled in the local sandbox, so the skeleton was created manually under `frontend/`.

Folders created:

```sh
mkdir -p frontend/src/app frontend/src/components frontend/src/constants frontend/assets
```

Important files added:

```txt
frontend/package.json
frontend/app.json
frontend/tsconfig.json
frontend/expo-env.d.ts
frontend/.gitignore
frontend/README.md
frontend/src/app/_layout.tsx
frontend/src/app/index.tsx
frontend/src/app/home.tsx
frontend/src/app/profile.tsx
frontend/src/components/Screen.tsx
frontend/src/constants/theme.ts
```

## Dependencies Installed

From the frontend directory:

```sh
npm install
```

Expo Doctor originally reported two issues when the project was on SDK 55:

- Missing `expo-font`, required by `@expo/vector-icons`
- `react-native` needed to match Expo SDK 55's expected patch version

Fix command used:

```sh
npx expo install expo-font react-native
```

This updated React Native to the Expo-compatible version and added the Expo Font config plugin.

## Downgrade To Expo SDK 54

The iOS test device had Expo Go for SDK 54 and could not update to the newer SDK 55-compatible Expo Go. To match the installed Expo Go app, the frontend was downgraded from SDK 55 to SDK 54.

Commands used:

```sh
npx expo install expo@~54.0.0
npx expo install --fix
```

Important SDK 54 versions after the downgrade:

```txt
expo: ~54.0.0
expo-router: ~6.0.23
react: 19.1.0
react-dom: 19.1.0
react-native: 0.81.5
react-native-screens: ~4.16.0
```

## Current Scripts

The frontend project includes these npm scripts:

```sh
npm run start
npm run ios
npm run android
npm run web
npm run typecheck
```

## Verification Commands

Run TypeScript checking:

```sh
npm run typecheck
```

Run Expo project health checks:

```sh
npx expo-doctor
```

Export the web build:

```sh
npx expo export --platform web --output-dir dist
```

Serve the exported web build locally:

```sh
python3 -u -m http.server 8091 --bind 127.0.0.1 -d dist
```

Then open:

```txt
http://127.0.0.1:8091
```

## Remote Testing During Development

For free remote testing on real phones, use Expo's tunnel mode. This creates a public Expo development URL that people in another location can open with Expo Go.

From the frontend directory:

```sh
cd /Users/ankit/Apps/frontend
npx expo start --tunnel
```

If the default tunnel fails with an ngrok client error, use the alternate tunnel subdomain mode:

```sh
cd /Users/ankit/Apps/frontend
EXPO_TUNNEL_SUBDOMAIN=true npx expo start --tunnel --clear
```

Then share the QR code or Expo link shown in the terminal.

If Expo asks for the tunnel helper, install it:

```sh
npm install --save-dev @expo/ngrok@^4.1.0
```

This project already has `@expo/ngrok` installed as a development dependency so tunnel mode can start without Expo prompting for a global install.

Requirements for testers:

- Install Expo Go on their phone.
- Use an Expo Go version that supports this project's Expo SDK version.
- Keep your development machine running while they test.

Current project SDK:

```txt
Expo SDK 54
```

Notes:

- Tunnel mode is slower than testing on the same Wi-Fi network.
- This is best for early feedback during development.
- It does not create a standalone app-store-style install.
- For web-only preview, export the web build and deploy the `dist/` folder to a free static host such as Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

## Validation Results

The current frontend passed:

```txt
npm run typecheck
npx expo-doctor
npx expo export --platform web --output-dir dist
```

Expo Doctor result after the SDK 54 downgrade:

```txt
17/17 checks passed. No issues detected.
```

## Notes

The app is intentionally configured as a **phone-first app**.

Web support is present, but web should not drive product decisions. Web may be limited, read-only, or less polished if needed. Mobile functionality should not be weakened for web compatibility.

`npm install` reported moderate vulnerabilities from the dependency tree. These were not force-fixed because Expo projects rely on SDK-compatible dependency versions, and `npm audit fix --force` can break compatibility.
