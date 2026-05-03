import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useMemo } from 'react';
import { PanResponder, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';
import { getCurrentUser } from '../services/authService';

const homeLocation = {
  city: 'Kathmandu',
  countryCode: 'NP',
};

const avatarAccent = '#003577';

export default function HomeScreen() {
  const currentUser = getCurrentUser();
  const avatarInitial = currentUser?.displayName.trim().charAt(0).toUpperCase();
  const swipeToPeopleResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          gestureState.dx > 24 && Math.abs(gestureState.dy) < 24,
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > 72 && Math.abs(gestureState.dy) < 48) {
            router.push('/people');
          }
        },
      }),
    [],
  );

  return (
    <Screen>
      <View style={styles.homeContent} {...swipeToPeopleResponder.panHandlers}>
        <View style={styles.topBar}>
          <Link href="/people" asChild>
            <Pressable style={({ pressed }) => [styles.brandButton, pressed && styles.brandPressed]}>
              <View style={styles.brandGroup}>
                <Text style={styles.appName}>Namaste</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={15} color={colors.primary} />
                  <Text style={styles.locationText}>
                    {homeLocation.city}, {homeLocation.countryCode}
                  </Text>
                </View>
              </View>
            </Pressable>
          </Link>

          <Link href={currentUser ? '/profile' : '/register'} asChild>
            <Pressable style={({ pressed }) => [styles.avatarButton, pressed && styles.avatarPressed]}>
              {avatarInitial ? (
                <Text style={styles.avatarInitial}>{avatarInitial}</Text>
              ) : (
                <Ionicons name="person-outline" size={22} color={avatarAccent} />
              )}
            </Pressable>
          </Link>
        </View>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>Community nearby</Text>
          <Text style={styles.title}>Connect, notice, and share locally.</Text>
          <Text style={styles.subtitle}>
            Find people, notices, posts, and basic buy/sell updates around your city.
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
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  homeContent: {
    gap: spacing.md,
  },
  topBar: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  brandButton: {
    flex: 1,
    minHeight: 58,
    justifyContent: 'center',
    marginLeft: -spacing.sm,
    paddingLeft: spacing.sm,
    paddingRight: spacing.md,
    borderRadius: radius.md,
  },
  brandGroup: {
    gap: spacing.xs,
    minWidth: 0,
  },
  appName: {
    color: avatarAccent,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 34,
  },
  brandPressed: {
    opacity: 0.72,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationText: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  avatarButton: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: avatarAccent,
    borderRadius: 23,
    backgroundColor: '#EEF6FF',
  },
  avatarPressed: {
    backgroundColor: '#DCEEFF',
  },
  avatarInitial: {
    color: avatarAccent,
    fontSize: 18,
    fontWeight: '900',
  },
  header: {
    gap: spacing.sm,
    paddingTop: spacing.md,
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
});
