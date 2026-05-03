export type RegisterMethod = 'email' | 'phone';

export type StartRegistrationInput = {
  method: RegisterMethod;
  identifier: string;
};

export type VerifyRegistrationInput = StartRegistrationInput & {
  code: string;
};

export type CompleteRegistrationProfileInput = {
  userId: string;
  displayName: string;
  method: RegisterMethod;
  verifiedIdentifier: string;
};

export type RegistrationResult = {
  userId: string;
  displayNameRequired: boolean;
  verifiedIdentifier: string;
  method: RegisterMethod;
};

export type RegisteredUser = {
  userId: string;
  displayName: string;
  email?: string;
  phone?: string;
  sessionId: string;
};

const mockDelay = 450;
const validCode = '123456';
let currentUser: RegisteredUser | null = null;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function normalizeIdentifier(method: RegisterMethod, identifier: string) {
  const trimmed = identifier.trim();

  if (method === 'email') {
    return trimmed.toLowerCase();
  }

  return trimmed.replace(/[^\d+]/g, '');
}

export function validateIdentifier(method: RegisterMethod, identifier: string) {
  const normalized = normalizeIdentifier(method, identifier);

  if (method === 'email') {
    const hasEmailShape = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
    return hasEmailShape ? '' : 'Enter a valid email address.';
  }

  const digitCount = normalized.replace(/\D/g, '').length;

  if (!normalized.startsWith('+')) {
    return 'Enter phone number with country code, like +1 555 123 4567.';
  }

  return digitCount >= 10 ? '' : 'Enter a valid phone number.';
}

export async function startRegistration(input: StartRegistrationInput) {
  const normalizedIdentifier = normalizeIdentifier(input.method, input.identifier);
  const validationError = validateIdentifier(input.method, normalizedIdentifier);

  if (validationError) {
    throw new Error(validationError);
  }

  await wait(mockDelay);

  return {
    deliveryTarget: normalizedIdentifier,
    method: input.method,
  };
}

export async function verifyRegistration(input: VerifyRegistrationInput): Promise<RegistrationResult> {
  const normalizedIdentifier = normalizeIdentifier(input.method, input.identifier);

  await wait(mockDelay);

  if (input.code.trim() !== validCode) {
    throw new Error('Use verification code 123456 for this development build.');
  }

  return {
    userId: 'new-user',
    displayNameRequired: true,
    verifiedIdentifier: normalizedIdentifier,
    method: input.method,
  };
}

export async function completeRegistrationProfile(
  input: CompleteRegistrationProfileInput,
): Promise<RegisteredUser> {
  await wait(mockDelay);

  const displayName = input.displayName.trim();

  if (displayName.length < 2) {
    throw new Error('Display name must be at least 2 characters.');
  }

  currentUser = {
    userId: input.userId,
    displayName,
    email: input.method === 'email' ? input.verifiedIdentifier : undefined,
    phone: input.method === 'phone' ? input.verifiedIdentifier : undefined,
    sessionId: 'mock-session',
  };

  return currentUser;
}

export function getCurrentUser() {
  return currentUser;
}
