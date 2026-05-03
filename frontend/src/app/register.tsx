import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';
import {
  RegisterMethod,
  startRegistration,
  verifyRegistration,
} from '../services/authService';

type Step = 'identifier' | 'code';

export default function RegisterScreen() {
  const [method, setMethod] = useState<RegisterMethod>('email');
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<Step>('identifier');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedIdentifier = identifier.trim();
  const canRequestCode = normalizedIdentifier.length > 3 && !isSubmitting;
  const canVerifyCode = code.trim().length >= 6 && !isSubmitting;

  const inputConfig = useMemo(() => {
    if (method === 'email') {
      return {
        icon: 'mail-outline' as const,
        label: 'Email',
        placeholder: 'name@example.com',
        keyboardType: 'email-address' as const,
        textContentType: 'emailAddress' as const,
        autoComplete: 'email' as const,
      };
    }

    return {
      icon: 'call-outline' as const,
      label: 'Phone',
      placeholder: '+1 555 123 4567',
      keyboardType: 'phone-pad' as const,
      textContentType: 'telephoneNumber' as const,
      autoComplete: 'tel' as const,
    };
  }, [method]);

  async function handleRequestCode() {
    if (!canRequestCode) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await startRegistration({ method, identifier: normalizedIdentifier });
      setCode('');
      setStep('code');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not send code.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyCode() {
    if (!canVerifyCode) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await verifyRegistration({ method, identifier: normalizedIdentifier, code });
      router.replace('/profile');
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : 'Could not verify code.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChangeMethod(nextMethod: RegisterMethod) {
    setMethod(nextMethod);
    setIdentifier('');
    setCode('');
    setError('');
    setStep('identifier');
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Link href="/home" asChild>
            <Pressable style={({ pressed }) => [styles.backButton, pressed && styles.lightPressed]}>
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </Pressable>
          </Link>

          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Register with email or phone. No password required.
          </Text>
        </View>

        <View style={styles.segmentedControl}>
          <MethodButton
            icon="mail-outline"
            label="Email"
            selected={method === 'email'}
            onPress={() => handleChangeMethod('email')}
          />
          <MethodButton
            icon="call-outline"
            label="Phone"
            selected={method === 'phone'}
            onPress={() => handleChangeMethod('phone')}
          />
        </View>

        {step === 'identifier' ? (
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{inputConfig.label}</Text>
              <View style={styles.inputShell}>
                <Ionicons name={inputConfig.icon} size={20} color={colors.mutedText} />
                <TextInput
                  autoCapitalize="none"
                  autoComplete={inputConfig.autoComplete}
                  keyboardType={inputConfig.keyboardType}
                  onChangeText={setIdentifier}
                  placeholder={inputConfig.placeholder}
                  placeholderTextColor={colors.mutedText}
                  style={styles.input}
                  textContentType={inputConfig.textContentType}
                  value={identifier}
                />
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
              disabled={!canRequestCode}
              onPress={handleRequestCode}
              style={({ pressed }) => [
                styles.primaryButton,
                !canRequestCode && styles.disabledButton,
                pressed && canRequestCode && styles.primaryButtonPressed,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Send Code</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </>
              )}
            </Pressable>
          </View>
        ) : (
          <View style={styles.formSection}>
            <View style={styles.sentRow}>
              <Ionicons name="checkmark-circle" size={22} color={colors.success} />
              <Text style={styles.sentText}>Code sent to {normalizedIdentifier}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Verification code</Text>
              <TextInput
                keyboardType="number-pad"
                maxLength={6}
                onChangeText={setCode}
                placeholder="000000"
                placeholderTextColor={colors.mutedText}
                style={styles.codeInput}
                textContentType="oneTimeCode"
                value={code}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
              disabled={!canVerifyCode}
              onPress={handleVerifyCode}
              style={({ pressed }) => [
                styles.primaryButton,
                !canVerifyCode && styles.disabledButton,
                pressed && canVerifyCode && styles.primaryButtonPressed,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Verify</Text>
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                </>
              )}
            </Pressable>

            <Pressable
              disabled={isSubmitting}
              onPress={() => {
                setStep('identifier');
                setError('');
              }}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.lightPressed]}
            >
              <Ionicons name="create-outline" size={18} color={colors.primary} />
              <Text style={styles.secondaryButtonText}>Change {method}</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

type MethodButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  selected: boolean;
  onPress: () => void;
};

function MethodButton({ icon, label, selected, onPress }: MethodButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.methodButton,
        selected && styles.methodButtonSelected,
        pressed && styles.lightPressed,
      ]}
    >
      <Ionicons name={icon} size={19} color={selected ? colors.primary : colors.mutedText} />
      <Text style={[styles.methodButtonText, selected && styles.methodButtonTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
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
  segmentedControl: {
    minHeight: 54,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#EEF2F7',
  },
  methodButton: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.sm,
  },
  methodButtonSelected: {
    backgroundColor: colors.surface,
  },
  methodButtonText: {
    color: colors.mutedText,
    fontSize: 15,
    fontWeight: '700',
  },
  methodButtonTextSelected: {
    color: colors.primary,
  },
  formSection: {
    gap: spacing.md,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  inputShell: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    minWidth: 0,
  },
  codeInput: {
    minHeight: 58,
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  sentRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: radius.md,
    backgroundColor: '#F0FDF4',
  },
  sentText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  primaryButtonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.48,
  },
  lightPressed: {
    opacity: 0.72,
  },
});
