import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Image,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';
import { NepaliCalendarDropdown } from '../features/home/NepaliCalendarDropdown';
import { CityTimeCard } from '../features/home/cityTime/CityTimeCard';
import { HomeFeedGroups } from '../features/home/feed/HomeFeedGroups';
import { ForeignExchangeCard } from '../features/home/foreignExchange/ForeignExchangeCard';
import { GoldPriceCard } from '../features/home/goldPrice/GoldPriceCard';
import { HoroscopeCard } from '../features/home/horoscope/HoroscopeCard';
import { NepaliNewsCard } from '../features/home/news/NepaliNewsCard';
import { SuchanaPatiHomeCard } from '../features/home/suchanaPati/SuchanaPatiHomeCard';
import {
  defaultHomePreferences,
  getHomeFeedItems,
  headerFlag,
  homeLocationOptions,
  type HomeLocation,
} from '../features/home/homeData';
import { placeholderNepaliDateResponse } from '../features/home/nepaliCalendarData';
import { getCurrentUser } from '../services/authService';
const avatarAccent = '#003577';

export default function HomeScreen() {
  const currentUser = getCurrentUser();
  const [homeLocation, setHomeLocation] = useState<HomeLocation>(defaultHomePreferences.location);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isNepaliCalendarExpanded, setIsNepaliCalendarExpanded] = useState(false);
  const nepaliDate = placeholderNepaliDateResponse.data;
  const homeFeedItems = getHomeFeedItems();
  const avatarInitial = currentUser?.displayName.trim().charAt(0).toUpperCase();
  const swipeToPeopleResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          gestureState.dx > 12 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.4,
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > 48 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.4) {
            router.replace('/people');
          }
        },
      }),
    [],
  );

  return (
    <Screen scrollProps={swipeToPeopleResponder.panHandlers}>
      <View style={styles.homeContent}>
        <View style={styles.heroBand}>
          <View style={styles.topBar}>
            <View style={styles.brandBlock}>
              <Link href="/people" replace asChild>
                <Pressable style={({ pressed }) => [styles.brandButton, pressed && styles.brandPressed]}>
                  <View style={styles.brandMenuRow}>
                    <View style={styles.menuDashGroup}>
                      <View style={styles.menuDash} />
                      <View style={styles.menuDash} />
                      <View style={styles.menuDash} />
                    </View>
                    <Text style={styles.appName}>Namaste</Text>
                  </View>
                </Pressable>
              </Link>

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: isLocationPickerOpen }}
                onPress={() => setIsLocationPickerOpen((isOpen) => !isOpen)}
                style={({ pressed }) => [
                  styles.locationButton,
                  isLocationPickerOpen && styles.locationButtonOpen,
                  pressed && styles.brandPressed,
                ]}
              >
                <Ionicons name="location-outline" size={15} color={colors.primary} />
                <Text style={styles.locationText}>
                  {homeLocation.city}, {homeLocation.countryCode}
                </Text>
                <Ionicons
                  name={isLocationPickerOpen ? 'chevron-up' : 'chevron-down'}
                  size={15}
                  color={colors.mutedText}
                />
              </Pressable>
            </View>

            <View style={styles.headerActions}>
              <View accessibilityLabel={headerFlag.label} style={styles.headerFlag}>
                <Image
                  accessibilityIgnoresInvertColors
                  source={{ uri: headerFlag.imageUrl }}
                  style={styles.headerFlagImage}
                />
              </View>

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
          </View>

          <View pointerEvents="none" style={styles.flagAccent}>
            <View style={styles.flagLineBlue} />
            <View style={styles.flagLineRed} />
            <View style={styles.flagLineWhite} />
          </View>
        </View>

        <View style={styles.header}>
          {isLocationPickerOpen ? (
            <View style={styles.locationMenu}>
              {homeLocationOptions.map((location) => {
                const isSelected =
                  location.city === homeLocation.city &&
                  location.countryCode === homeLocation.countryCode;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={`${location.city}-${location.countryCode}`}
                    onPress={() => {
                      setHomeLocation(location);
                      setIsLocationPickerOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.locationOption,
                      isSelected && styles.locationOptionSelected,
                      pressed && styles.locationOptionPressed,
                    ]}
                  >
                    <View style={styles.locationOptionText}>
                      <Text
                        style={[
                          styles.locationOptionCity,
                          isSelected && styles.locationOptionCitySelected,
                        ]}
                      >
                        {location.city}
                      </Text>
                      <Text style={styles.locationOptionCountry}>{location.countryCode}</Text>
                    </View>
                    {isSelected ? (
                      <Ionicons name="checkmark" size={18} color={colors.primary} />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isNepaliCalendarExpanded }}
          onPress={() => setIsNepaliCalendarExpanded((isExpanded) => !isExpanded)}
          style={({ pressed }) => [
            styles.moduleCard,
            styles.dateModuleCard,
            isNepaliCalendarExpanded && styles.moduleCardExpanded,
            pressed && styles.moduleCardPressed,
          ]}
        >
          <View style={[styles.moduleAccent, styles.dateModuleAccent]} />
          <View style={styles.moduleHeader}>
            <View style={[styles.cardIcon, styles.dateCardIcon]}>
              <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>आजको मिति</Text>
              <Text style={styles.cardDescription}>{nepaliDate}</Text>
            </View>
            <Ionicons
              name={isNepaliCalendarExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.mutedText}
            />
          </View>
        </Pressable>

        {isNepaliCalendarExpanded ? <NepaliCalendarDropdown /> : null}

        <CityTimeCard />

        <ForeignExchangeCard />

        <SuchanaPatiHomeCard />

        <NepaliNewsCard />

        <HomeFeedGroups items={homeFeedItems} />

        <HoroscopeCard />

        <GoldPriceCard homeLocation={homeLocation} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  homeContent: {
    gap: spacing.sm,
    marginHorizontal: -spacing.md,
    marginBottom: -spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: '#DBEAFE',
  },
  heroBand: {
    gap: spacing.xs,
    marginHorizontal: -spacing.md,
    marginTop: -spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: '#FBD7DE',
  },
  topBar: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  brandButton: {
    alignSelf: 'flex-start',
    minHeight: 34,
    justifyContent: 'center',
    marginLeft: -spacing.sm,
    paddingLeft: spacing.sm,
    paddingRight: spacing.md,
    borderRadius: radius.md,
  },
  brandBlock: {
    flex: 1,
    gap: 0,
    minWidth: 0,
  },
  appName: {
    color: avatarAccent,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 34,
  },
  brandMenuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuDashGroup: {
    gap: 3,
    paddingTop: 2,
  },
  menuDash: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: avatarAccent,
  },
  brandPressed: {
    opacity: 0.72,
  },
  locationButton: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginLeft: -spacing.sm,
    paddingLeft: spacing.sm,
    paddingRight: spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: radius.md,
  },
  locationButtonOpen: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  locationText: {
    flexShrink: 1,
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerFlag: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: radius.md,
    backgroundColor: '#FFF7F7',
  },
  headerFlagImage: {
    width: 28,
    height: 34,
    resizeMode: 'contain',
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
  flagAccent: {
    width: 132,
    height: 6,
    flexDirection: 'row',
    marginTop: -spacing.sm,
    marginBottom: 0,
    overflow: 'hidden',
    borderRadius: 4,
  },
  flagLineBlue: {
    flex: 3,
    backgroundColor: avatarAccent,
  },
  flagLineRed: {
    flex: 5,
    backgroundColor: '#DC143C',
  },
  flagLineWhite: {
    flex: 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  header: {
    gap: spacing.sm,
    paddingTop: 0,
  },
  locationMenu: {
    alignSelf: 'stretch',
    gap: spacing.xs,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  locationOption: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  locationOptionSelected: {
    backgroundColor: '#EFF6FF',
  },
  locationOptionPressed: {
    backgroundColor: '#F1F5F9',
  },
  locationOptionText: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  locationOptionCity: {
    flexShrink: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  locationOptionCitySelected: {
    color: colors.primary,
  },
  locationOptionCountry: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '800',
  },
  moduleCard: {
    minHeight: 82,
    padding: spacing.md,
    overflow: 'hidden',
    backgroundColor: '#F8FBFF',
    borderColor: '#93C5FD',
    borderWidth: 1,
    borderRadius: radius.md,
  },
  dateModuleCard: {
    borderColor: '#93C5FD',
    backgroundColor: '#F8FBFF',
  },
  moduleAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  dateModuleAccent: {
    backgroundColor: '#2563EB',
  },
  moduleCardExpanded: {
    borderColor: '#93C5FD',
    backgroundColor: '#F8FBFF',
  },
  moduleCardPressed: {
    backgroundColor: '#F1F5F9',
  },
  moduleHeader: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: '#DBEAFE',
  },
  dateCardIcon: {
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
  cardDescription: {
    color: colors.mutedText,
    fontSize: 15,
    fontWeight: '700',
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
