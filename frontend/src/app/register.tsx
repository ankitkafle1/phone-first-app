import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';
import { signInWithGoogleIdToken } from '../services/authService';

const googleConfig = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  scopes: ['profile', 'email'],
};

type GoogleSignInModule = typeof import('@react-native-google-signin/google-signin');

declare const require: (moduleName: string) => GoogleSignInModule;

function loadGoogleSignIn() {
  try {
    return require('@react-native-google-signin/google-signin');
  } catch {
    return null;
  }
}

export default function RegisterScreen() {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSdkAvailable, setIsGoogleSdkAvailable] = useState(true);

  const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
  const isConfigured = Boolean(googleConfig.webClientId);
  const canSignIn = isNative && isConfigured && isGoogleSdkAvailable && !isSubmitting;

  const unavailableMessage = useMemo(() => {
    if (!isNative) {
      return 'Google Sign-In is available in the iOS and Android app builds.';
    }

    if (!isGoogleSdkAvailable) {
      return 'Google Sign-In needs a custom development build. Expo Go does not include this native module.';
    }

    if (!isConfigured) {
      return 'Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID before starting the app.';
    }

    return '';
  }, [isConfigured, isGoogleSdkAvailable, isNative]);

  useEffect(() => {
    if (!isNative) {
      return;
    }

    const googleSignIn = loadGoogleSignIn();

    if (!googleSignIn) {
      setIsGoogleSdkAvailable(false);
      return;
    }

    googleSignIn.GoogleSignin.configure(googleConfig);
  }, []);

  async function handleGoogleSignIn() {
    if (!canSignIn) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const googleSignIn = loadGoogleSignIn();

      if (!googleSignIn) {
        setIsGoogleSdkAvailable(false);
        throw new Error(
          'Google Sign-In needs a custom development build. Expo Go does not include this native module.',
        );
      }

      if (Platform.OS === 'android') {
        await googleSignIn.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }

      const response = await googleSignIn.GoogleSignin.signIn();

      if (googleSignIn.isCancelledResponse(response)) {
        return;
      }

      const { idToken, user } = response.data;

      await signInWithGoogleIdToken(idToken ?? '', {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      });

      router.replace('/profile');
    } catch (signInError) {
      const googleSignIn = loadGoogleSignIn();

      if (googleSignIn?.isErrorWithCode(signInError)) {
        setError(`Google Sign-In failed: ${signInError.code}`);
        return;
      }

      setError(signInError instanceof Error ? signInError.message : 'Could not sign in with Google.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.header}>
          <Link href="/home" asChild>
            <Pressable style={({ pressed }) => [styles.backButton, pressed && styles.lightPressed]}>
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </Pressable>
          </Link>

          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>
            Use Google to verify your identity. Namaste receives an app access token and refresh
            token after Spring Boot verifies the Google ID token.
          </Text>
        </View>

        <View style={styles.authPanel}>
          <View style={styles.googleMark}>
            <Text style={styles.googleMarkText}>G</Text>
          </View>
          <Text style={styles.panelTitle}>Continue with Google</Text>
          <Text style={styles.panelText}>
            Your email and profile come from Google. No email, phone, password, or OTP form is
            needed in the app.
          </Text>

          {unavailableMessage ? <Text style={styles.helpText}>{unavailableMessage}</Text> : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            disabled={!canSignIn}
            onPress={handleGoogleSignIn}
            style={({ pressed }) => [
              styles.googleButton,
              !canSignIn && styles.disabledButton,
              pressed && canSignIn && styles.googleButtonPressed,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <>
                <Text style={styles.googleButtonMark}>G</Text>
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
  },
  authPanel: {
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  googleMark: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
  },
  googleMarkText: {
    color: '#4285F4',
    fontSize: 26,
    fontWeight: '800',
  },
  panelTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  panelText: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
  },
  googleButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  googleButtonPressed: {
    backgroundColor: '#F8FAFC',
  },
  googleButtonMark: {
    color: '#4285F4',
    fontSize: 18,
    fontWeight: '900',
  },
  googleButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.48,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
  },
  helpText: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  lightPressed: {
    opacity: 0.72,
  },
});
