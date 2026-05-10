import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useMemo } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';

const menuItems = [
  {
    accent: '#EA580C',
    background: '#FFF7ED',
    border: '#FDBA74',
    description: 'Local services, shops, and trusted listings',
    icon: 'storefront-outline' as const,
    label: 'Nepali Business',
    href: '/nepali-business' as const,
  },
  {
    accent: '#0EA5E9',
    background: '#F0F9FF',
    border: '#7DD3FC',
    description: 'Announcements, events, and community notices',
    icon: 'newspaper-outline' as const,
    label: 'Suchana Pati',
    href: '/suchana-pati' as const,
  },
  {
    accent: '#7C3AED',
    background: '#F5F3FF',
    border: '#C4B5FD',
    description: 'Stories, poems, and gazal from the community',
    icon: 'book-outline' as const,
    label: 'कथा / कविता',
    href: '/katha-kabita' as const,
  },
  {
    accent: '#16A34A',
    background: '#F0FDF4',
    border: '#86EFAC',
    description: 'Rooms, apartments, and shared spaces',
    icon: 'home-outline' as const,
    label: 'Rooms',
    href: '/rooms' as const,
  },
  {
    accent: '#A16207',
    background: '#FFFBEB',
    border: '#FDE68A',
    description: 'Buy, sell, and discover nearby items',
    icon: 'pricetag-outline' as const,
    label: 'Buy & Sell',
    href: '/buy-sell' as const,
  },
];

export default function PeopleScreen() {
  const swipeUpResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          gestureState.dy < -12 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.4,
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy < -48 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.4) {
            router.replace('/home');
          }
        },
      }),
    [],
  );

  return (
    <Screen
      contentProps={{ ...swipeUpResponder.panHandlers, style: styles.screenContent }}
      scroll={false}
    >
      <View style={styles.pageLayout}>
        <View style={styles.pageColumn}>
          <View style={styles.pageContent}>
            <View style={styles.topBar}>
              <Link href="/home" asChild>
                <Pressable style={({ pressed }) => [styles.backButton, pressed && styles.lightPressed]}>
                  <Ionicons name="arrow-back" size={20} color={colors.text} />
                </Pressable>
              </Link>
            </View>

            <View style={styles.menuHeader}>
              <Text style={styles.menuHeaderTitle}>Menu</Text>
              <Text style={styles.menuHeaderText}>Explore community tools and local updates.</Text>
            </View>

            <View style={styles.menuList}>
              {menuItems.map((item) => (
                <Pressable
                  accessibilityRole="button"
                  key={item.label}
                  onPress={() => {
                    if (item.href) {
                      router.push(item.href);
                    }
                  }}
                  style={({ pressed }) => [
                    styles.menuRow,
                    { backgroundColor: item.background, borderColor: item.border },
                    pressed && styles.lightPressed,
                  ]}
                >
                  <View style={[styles.menuAccent, { backgroundColor: item.accent }]} />
                  <View style={[styles.menuIcon, { borderColor: item.border }]}>
                    <Ionicons name={item.icon} size={21} color={item.accent} />
                  </View>
                  <View style={styles.menuTextGroup}>
                    <Text style={styles.menuText}>{item.label}</Text>
                    <Text style={styles.menuDescription}>{item.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={19} color={item.accent} />
                </Pressable>
              ))}
            </View>
          </View>
          <Pressable
            accessibilityLabel="Go back home"
            onPress={() => router.replace('/home')}
            style={styles.belowArea}
          />
        </View>
        <Pressable
          accessibilityLabel="Go back home"
          onPress={() => router.replace('/home')}
          style={styles.outsideArea}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    maxWidth: '100%',
    alignSelf: 'stretch',
    padding: 0,
    gap: 0,
  },
  pageLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  pageColumn: {
    flexBasis: '70%',
    flexGrow: 0,
    flexShrink: 0,
  },
  pageContent: {
    gap: spacing.sm,
    padding: spacing.md,
  },
  belowArea: {
    flex: 1,
  },
  outsideArea: {
    flex: 1,
  },
  topBar: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
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
  menuList: {
    gap: spacing.sm,
  },
  menuHeader: {
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.xs,
  },
  menuHeaderTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  menuHeaderText: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  menuRow: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  menuAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  menuIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  menuTextGroup: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  menuText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  menuDescription: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  lightPressed: {
    opacity: 0.72,
  },
});
