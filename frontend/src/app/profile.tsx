import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';
import { getCurrentUser } from '../services/authService';

export default function ProfileScreen() {
  const currentUser = getCurrentUser();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>
          {currentUser
            ? 'Your account is registered for this development session.'
            : 'Placeholder screen for account, preferences, and future authentication flows.'}
        </Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="person-circle" size={28} color={colors.primary} />
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>{currentUser?.displayName ?? 'Account foundation'}</Text>
          <Text style={styles.rowDescription}>
            {currentUser?.email
              ? `Verified email: ${currentUser.email}`
              : currentUser?.phone
                ? `Verified phone: ${currentUser.phone}`
                : 'This is where sign-in, user details, and notification preferences can start.'}
          </Text>
        </View>
      </View>

      <Link href="/home" asChild>
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Ionicons name="arrow-back" size={18} color={colors.primary} />
          <Text style={styles.buttonText}>Back Home</Text>
        </Pressable>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  rowText: {
    flex: 1,
    gap: spacing.xs,
  },
  rowTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  rowDescription: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  buttonPressed: {
    backgroundColor: '#F1F5F9',
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
