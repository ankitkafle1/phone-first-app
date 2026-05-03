export type RegisterMethod = 'email' | 'phone';

export type StartRegistrationInput = {
  method: RegisterMethod;
  identifier: string;
};

export type VerifyRegistrationInput = StartRegistrationInput & {
  code: string;
};

export type RegistrationResult = {
  userId: string;
  displayNameRequired: boolean;
};

const mockDelay = 450;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function startRegistration(input: StartRegistrationInput) {
  await wait(mockDelay);

  return {
    deliveryTarget: input.identifier,
    method: input.method,
  };
}

export async function verifyRegistration(input: VerifyRegistrationInput): Promise<RegistrationResult> {
  await wait(mockDelay);

  if (input.code.trim().length < 6) {
    throw new Error('Enter the 6-digit code.');
  }

  return {
    userId: 'new-user',
    displayNameRequired: true,
  };
}
