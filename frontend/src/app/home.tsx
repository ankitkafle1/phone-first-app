import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';

export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Phone-first app</Text>
        <Text style={styles.title}>Start with the mobile experience.</Text>
        <Text style={styles.subtitle}>
          iOS and Android drive the product. Web remains available as a limited access path.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardIcon}>
          <Ionicons name="phone-portrait" size={24} color={colors.primary} />
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>Mobile functionality wins</Text>
          <Text style={styles.cardText}>
            Camera, push notifications, biometrics, and other native features should be designed
            for phones first.
          </Text>
        </View>
      </View>

      {Platform.OS === 'web' ? (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Web preview: this target is intentionally secondary and may become read-only.
          </Text>
        </View>
      ) : null}

      <Link href="/register" asChild>
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>Create Account</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
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
  eyebrow: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
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
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  cardIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: '#DBEAFE',
  },
  cardBody: {
    flex: 1,
    gap: spacing.xs,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  cardText: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
  },
  notice: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
  },
  noticeText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
