# Phone-First App Plan

## Decision

We will build the app using **React Native with Expo**.

The app should be **primarily designed for phones**, with iOS and Android as the main product experience. Web should be supported as an additional access path for people who prefer or need to use it in a browser, but the product should not become web-first or even web-equal.

We should never compromise the phone experience to make the web version smoother. If a feature works best on mobile, we should build it for mobile first and let the web version be limited, read-only, or unavailable if needed.

Expo is still the right fit because it gives us one TypeScript codebase that can ship to **iOS**, **Android**, and **web**, with a fast development loop, app-store build support through Expo/EAS, and a strong ecosystem for mobile features like navigation, camera, push notifications, authentication, and payments.

## Frontend Stack

- **Framework:** React Native
- **Platform tooling:** Expo
- **Language:** TypeScript
- **Routing:** Expo Router
- **Targets:** iOS and Android first; web as a limited secondary access path
- **Builds and releases:** EAS Build / EAS Submit
- **State management:** Start simple with React state and context; add Zustand or TanStack Query when needed
- **Styling:** NativeWind or Tamagui, depending on how custom the UI needs to be

## Product Posture

This should be a **phone-first app with optional web access**.

That means:

- The main interaction model should feel natural on a phone.
- Mobile navigation patterns are allowed and expected.
- Web should not drive product or technical decisions.
- Web can be read-only, limited, or less polished when needed.
- Desktop layouts can be simple responsive adaptations of the mobile experience.
- Mobile functionality should not be removed, weakened, or delayed because of web support.
- We should avoid native-only packages unless there is a good reason, so the web version does not become expensive to maintain.
- For features that are naturally mobile-first, such as push notifications, camera, contacts, location, biometrics, or app-store subscriptions, mobile behavior takes priority.

Practical layout rule:

Design the default experience for phone screens first. On web, center or constrain the app content when that produces a better experience than stretching everything across the browser. If a web feature becomes awkward or costly, prefer a simpler web version over compromising the phone app.

## Web Support Boundary

The web version exists for convenience and accessibility, not as the primary product.

Acceptable web limitations:

- Some features may be read-only.
- Some flows may redirect users to the mobile app.
- Some mobile-native features may be unavailable.
- Some interactions may be less smooth than native mobile.
- Web release timing can lag behind mobile if needed.

Non-negotiable:

- Do not weaken phone functionality for web compatibility.
- Do not avoid valuable mobile-native features only because web support is harder.
- Do not let desktop layout needs reshape the core phone UX.

## Backend Recommendation

Because you already have experience with **Spring Boot**, the best default backend choice is:

**Spring Boot API + PostgreSQL**

This is a strong fit if we want a real production backend with clear business logic, ownership of data, long-term flexibility, and room to grow.

Recommended backend stack:

- **Backend framework:** Spring Boot
- **Language:** Java or Kotlin
- **Database:** PostgreSQL
- **Authentication:** Spring Security with JWT, or managed auth if we want to move faster
- **API style:** REST first; GraphQL only if the app later needs complex flexible querying
- **Hosting:** Render, Fly.io, Railway, AWS, or Google Cloud
- **File storage:** S3-compatible storage such as AWS S3, Cloudflare R2, or Supabase Storage

## Why Spring Boot Is A Good Fit

- You already know it, so we can move faster and debug with confidence.
- It is excellent for structured business logic, APIs, database-backed apps, background jobs, and integrations.
- It scales well from a small app to a serious production system.
- It keeps us independent from backend-as-a-service limits.

## Alternative Backend Options

### Supabase

Good if we want to move very quickly with built-in auth, Postgres, storage, and realtime features.

Tradeoff: Less custom backend control unless we combine it with a separate API.

### Firebase

Good for realtime apps, push notifications, analytics, and fast prototyping.

Tradeoff: NoSQL data modeling can become awkward for relational business data, and vendor lock-in is stronger.

### Node.js / NestJS

Good if we want the whole stack in TypeScript.

Tradeoff: Since you already know Spring Boot, NestJS is probably not worth switching to unless shared TypeScript across frontend and backend becomes a major priority.

## Current Recommendation

Start with:

**React Native + Expo frontend**  
**iOS and Android as primary targets**  
**Web as a limited secondary access path**  
**Spring Boot backend**  
**PostgreSQL database**

This gives us a practical, production-ready foundation while staying close to skills you already have.

## Next Decisions

- What is the app's core purpose?
- Does it need user accounts?
- Does it need offline support?
- Does it need push notifications?
- Does it need payments or subscriptions?
- Does it need admin tools or a web dashboard?
- Should the backend be deployed early, or should we mock data while designing the first screens?
