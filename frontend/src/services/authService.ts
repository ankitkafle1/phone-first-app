export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type RegisteredUser = {
  userId: string;
  displayName: string;
  email: string;
  photoUrl?: string;
  tokens: AuthTokens;
};

type GoogleTokenExchangeResponse = {
  accessToken: string;
  refreshToken: string;
  user?: {
    id?: string;
    userId?: string;
    displayName?: string;
    name?: string;
    email?: string;
    photoUrl?: string;
    picture?: string;
  };
};

type GoogleSignInProfile = {
  id?: string;
  name?: string | null;
  email?: string;
  photo?: string | null;
};

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
const googleExchangePath = process.env.EXPO_PUBLIC_GOOGLE_AUTH_PATH ?? '/api/auth/google';

let currentUser: RegisteredUser | null = null;

function joinUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function resolveUser(
  response: GoogleTokenExchangeResponse,
  googleProfile?: GoogleSignInProfile,
): RegisteredUser {
  const user = response.user;
  const userId = user?.userId ?? user?.id ?? googleProfile?.id;
  const displayName = user?.displayName ?? user?.name ?? googleProfile?.name;
  const email = user?.email ?? googleProfile?.email;
  const photoUrl = user?.photoUrl ?? user?.picture ?? googleProfile?.photo ?? undefined;

  if (!userId || !displayName || !email) {
    throw new Error('Spring Boot did not return enough user details.');
  }

  return {
    userId,
    displayName,
    email,
    photoUrl,
    tokens: {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    },
  };
}

export async function signInWithGoogleIdToken(
  idToken: string,
  googleProfile?: GoogleSignInProfile,
): Promise<RegisteredUser> {
  if (!idToken) {
    throw new Error('Google did not return an ID token.');
  }

  const response = await fetch(joinUrl(apiBaseUrl, googleExchangePath), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Spring Boot could not verify Google sign-in.');
  }

  const data = (await response.json()) as GoogleTokenExchangeResponse;

  if (!data.accessToken || !data.refreshToken) {
    throw new Error('Spring Boot did not return app tokens.');
  }

  currentUser = resolveUser(data, googleProfile);
  return currentUser;
}

export function getCurrentUser() {
  return currentUser;
}

export function getAccessToken() {
  return currentUser?.tokens.accessToken ?? null;
}

export function clearCurrentUser() {
  currentUser = null;
}
