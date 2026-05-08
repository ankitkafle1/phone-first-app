import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useMemo } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';

const menuItems = [
  { icon: 'storefront-outline' as const, label: 'Nepali Business', href: '/nepali-business' as const },
  { icon: 'newspaper-outline' as const, label: 'Suchana Pati', href: '/suchana-pati' as const },
  { icon: 'book-outline' as const, label: 'कथा / कविता', href: '/katha-kabita' as const },
  { icon: 'home-outline' as const, label: 'Rooms', href: '/rooms' as const },
  { icon: 'pricetag-outline' as const, label: 'Buy & Sell', href: '/buy-sell' as const },
  { icon: 'person-outline' as const, label: 'Profile' },
  { icon: 'notifications-outline' as const, label: 'Notifications' },
  { icon: 'settings-outline' as const, label: 'Settings' },
  { icon: 'help-circle-outline' as const, label: 'Help' },
  { icon: 'information-circle-outline' as const, label: 'About' },
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
                  style={({ pressed }) => [styles.menuRow, pressed && styles.lightPressed]}
                >
                  <View style={styles.menuIcon}>
                    <Ionicons name={item.icon} size={20} color="#003577" />
                  </View>
                  <Text style={styles.menuText}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.mutedText} />
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
    gap: spacing.md,
    padding: spacing.md,
  },
  belowArea: {
    flex: 1,
  },
  outsideArea: {
    flex: 1,
  },
  topBar: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.sm,
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
  menuRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  menuIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
  },
  menuText: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  lightPressed: {
    opacity: 0.72,
  },
});
