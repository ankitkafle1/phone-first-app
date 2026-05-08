import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Linking,
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
import { HomeFeedGroups } from '../features/home/feed/HomeFeedGroups';
import { HoroscopeCard } from '../features/home/horoscope/HoroscopeCard';
import {
  cityCatalog,
  cityImageUrls,
  defaultHomePreferences,
  exchangeRates,
  formatDate,
  formatTime,
  getHomeFeedItems,
  goldVendorsByLocation,
  headerFlag,
  homeLocationOptions,
  preciousMetalRates,
  type HomeLocation,
} from '../features/home/homeData';
import { placeholderNepaliDateResponse } from '../features/home/nepaliCalendarData';
import { getCurrentUser } from '../services/authService';
const avatarAccent = '#003577';

export default function HomeScreen() {
  const currentUser = getCurrentUser();
  const [homeLocation, setHomeLocation] = useState<HomeLocation>(defaultHomePreferences.location);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [isNepaliCalendarExpanded, setIsNepaliCalendarExpanded] = useState(false);
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);
  const [visibleTimeCityIds, setVisibleTimeCityIds] = useState(
    defaultHomePreferences.timeCityIds,
  );
  const [selectedTimeCityId, setSelectedTimeCityId] = useState<string | null>(null);
  const [isAddCityOpen, setIsAddCityOpen] = useState(false);
  const [isForeignExchangeExpanded, setIsForeignExchangeExpanded] = useState(false);
  const [visibleExchangeRateCodes, setVisibleExchangeRateCodes] = useState(
    defaultHomePreferences.exchangeRateCodes,
  );
  const [isAddExchangeOpen, setIsAddExchangeOpen] = useState(false);
  const [isPreciousMetalExpanded, setIsPreciousMetalExpanded] = useState(false);
  const [visiblePreciousMetalCodes, setVisiblePreciousMetalCodes] =
    useState(defaultHomePreferences.preciousMetalCodes);
  const [isAddPreciousMetalOpen, setIsAddPreciousMetalOpen] = useState(false);
  const nepaliDate = placeholderNepaliDateResponse.data;
  const defaultExchangeRate = exchangeRates.find((rate) => rate.code === 'USD') ?? exchangeRates[0];
  const defaultPreciousMetal = preciousMetalRates[0];
  const homeFeedItems = getHomeFeedItems();
  const visibleExchangeRates = exchangeRates.filter((rate) =>
    visibleExchangeRateCodes.includes(rate.code),
  );
  const hiddenExchangeRates = exchangeRates.filter(
    (rate) => !visibleExchangeRateCodes.includes(rate.code),
  );
  const visiblePreciousMetalRates = preciousMetalRates.filter((metal) =>
    visiblePreciousMetalCodes.includes(metal.code),
  );
  const hiddenPreciousMetalRates = preciousMetalRates.filter(
    (metal) => !visiblePreciousMetalCodes.includes(metal.code),
  );
  const goldVendors = goldVendorsByLocation[`${homeLocation.city}-${homeLocation.countryCode}`] ?? [];
  const avatarInitial = currentUser?.displayName.trim().charAt(0).toUpperCase();
  const nepalCity = cityCatalog[0];
  const visibleTimeCities = cityCatalog.filter((city) => visibleTimeCityIds.includes(city.id));
  const hiddenTimeCities = cityCatalog.filter((city) => !visibleTimeCityIds.includes(city.id));
  const selectedTimeCity = cityCatalog.find((city) => city.id === selectedTimeCityId);
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

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  function handleRemoveTimeCity(cityId: string) {
    setVisibleTimeCityIds((cityIds) => cityIds.filter((id) => id !== cityId));

    if (selectedTimeCityId === cityId) {
      setSelectedTimeCityId(null);
    }
  }

  function handleAddTimeCity(cityId: string) {
    setVisibleTimeCityIds((cityIds) => [...cityIds, cityId]);
    setIsAddCityOpen(false);
  }

  function handleRemoveExchangeRate(code: string) {
    setVisibleExchangeRateCodes((codes) => codes.filter((visibleCode) => visibleCode !== code));
  }

  function handleAddExchangeRate(code: string) {
    setVisibleExchangeRateCodes((codes) => [...codes, code]);
    setIsAddExchangeOpen(false);
  }

  function handleRemovePreciousMetal(code: string) {
    setVisiblePreciousMetalCodes((codes) => codes.filter((visibleCode) => visibleCode !== code));
  }

  function handleAddPreciousMetal(code: string) {
    setVisiblePreciousMetalCodes((codes) => [...codes, code]);
    setIsAddPreciousMetalOpen(false);
  }

  function handleCallVendor(phone: string) {
    Linking.openURL(`tel:${phone}`);
  }

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

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isTimeExpanded }}
          onPress={() => setIsTimeExpanded((isExpanded) => !isExpanded)}
          style={({ pressed }) => [
            styles.moduleCard,
            styles.timeModuleCard,
            isTimeExpanded && styles.moduleCardExpanded,
            pressed && styles.moduleCardPressed,
          ]}
        >
          <View style={[styles.moduleAccent, styles.timeModuleAccent]} />
          <View style={styles.moduleHeader}>
            <View style={[styles.cardIcon, styles.timeCardIcon]}>
              <Ionicons name="time-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>
                {nepalCity.city}, {nepalCity.countryCode}
              </Text>
              <Text style={styles.cardDescription}>
                {nepalCity.temperature} · {nepalCity.weather}
              </Text>
            </View>
            <Text style={styles.cardSideValue}>{formatTime(now, nepalCity.timeZone)}</Text>
            <Ionicons
              name={isTimeExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.mutedText}
            />
          </View>
        </Pressable>

        {isTimeExpanded ? (
          <View style={styles.expandedPanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>City list</Text>
              <Text style={styles.panelHint}>Tap a city for date and weather</Text>
            </View>

            <View style={styles.cityList}>
              {visibleTimeCities.map((city) => {
                const isSelected = selectedTimeCityId === city.id;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={city.id}
                    onPress={() => setSelectedTimeCityId(isSelected ? null : city.id)}
                    style={({ pressed }) => [
                      styles.cityRow,
                      isSelected && styles.cityRowSelected,
                      pressed && styles.locationOptionPressed,
                    ]}
                  >
                    {cityImageUrls[city.id] ? (
                      <Image
                        accessibilityIgnoresInvertColors
                        source={{ uri: cityImageUrls[city.id] }}
                        style={styles.cityImage}
                      />
                    ) : (
                      <View style={styles.cityImageFallback}>
                        <Ionicons name="location-outline" size={20} color={colors.primary} />
                      </View>
                    )}
                    <View style={styles.cityRowMain}>
                      <Text style={[styles.cityName, isSelected && styles.cityNameSelected]}>
                        {city.city}, {city.countryCode}
                      </Text>
                      <Text style={styles.cityWeather}>{city.temperature} · {city.weather}</Text>
                    </View>
                    <View style={styles.cityRowSide}>
                      <Text style={styles.cityTime}>{formatTime(now, city.timeZone)}</Text>
                      <Ionicons name="chevron-forward" size={16} color={colors.mutedText} />
                    </View>
                    <Pressable
                      accessibilityLabel={`Remove ${city.city}`}
                      onPress={() => handleRemoveTimeCity(city.id)}
                      style={({ pressed }) => [
                        styles.iconButton,
                        pressed && styles.locationOptionPressed,
                      ]}
                    >
                      <Ionicons name="remove" size={18} color={colors.mutedText} />
                    </Pressable>
                  </Pressable>
                );
              })}
            </View>

            {hiddenTimeCities.length ? (
              <View style={styles.addCitySection}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isAddCityOpen }}
                  onPress={() => setIsAddCityOpen((isOpen) => !isOpen)}
                  style={({ pressed }) => [styles.addCityToggle, pressed && styles.locationOptionPressed]}
                >
                  <View style={styles.addCityToggleText}>
                    <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
                    <Text style={styles.addCityTitle}>Add city</Text>
                  </View>
                  <Ionicons
                    name={isAddCityOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.mutedText}
                  />
                </Pressable>

                {isAddCityOpen ? (
                  <View style={styles.addCityGrid}>
                    {hiddenTimeCities.map((city) => (
                      <Pressable
                        accessibilityRole="button"
                        key={city.id}
                        onPress={() => handleAddTimeCity(city.id)}
                        style={({ pressed }) => [
                          styles.addCityButton,
                          pressed && styles.locationOptionPressed,
                        ]}
                      >
                        <Ionicons name="add" size={16} color={colors.primary} />
                        <Text style={styles.addCityText}>
                          {city.city}, {city.countryCode}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>
            ) : null}

            {selectedTimeCity ? (
              <View style={styles.cityDetail}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                  <Text style={styles.detailText}>
                    {formatDate(now, selectedTimeCity.timeZone)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="partly-sunny-outline" size={18} color={colors.primary} />
                  <Text style={styles.detailText}>
                    {selectedTimeCity.temperature} · {selectedTimeCity.weather}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isForeignExchangeExpanded }}
          onPress={() => setIsForeignExchangeExpanded((isExpanded) => !isExpanded)}
          style={({ pressed }) => [
            styles.moduleCard,
            styles.exchangeModuleCard,
            isForeignExchangeExpanded && styles.moduleCardExpanded,
            pressed && styles.moduleCardPressed,
          ]}
        >
          <View style={[styles.moduleAccent, styles.exchangeModuleAccent]} />
          <View style={styles.moduleHeader}>
            <View style={[styles.cardIcon, styles.exchangeCardIcon]}>
              <Text style={styles.flagIcon}>{defaultExchangeRate.flag}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Foreign Exchange</Text>
              <Text style={styles.cardDescription}>
                {defaultExchangeRate.unit} {defaultExchangeRate.code} to Nepalese Rupee
              </Text>
            </View>
            <Text style={styles.cardSideValue}>{defaultExchangeRate.sell}</Text>
            <Ionicons
              name={isForeignExchangeExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.mutedText}
            />
          </View>
        </Pressable>

        {isForeignExchangeExpanded ? (
          <View style={styles.expandedPanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Currency list</Text>
              <Text style={styles.panelHint}>Add currencies to track sell rates in Nepalese Rupee</Text>
            </View>

            <View style={styles.exchangeList}>
              {visibleExchangeRates.map((rate) => (
                <View key={rate.code} style={styles.exchangeRow}>
                  <Text style={styles.exchangeFlag}>{rate.flag}</Text>
                  <View style={styles.exchangeMain}>
                    <Text style={styles.exchangeTitle}>
                      {rate.code} · {rate.name}
                    </Text>
                    <Text style={styles.exchangeMeta}>
                      {rate.unit} {rate.code} to Nepalese Rupee
                    </Text>
                  </View>
                  <View style={styles.exchangeRowSide}>
                    <Text style={styles.exchangeValue}>{rate.sell ?? '-'}</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.mutedText} />
                  </View>
                  <Pressable
                    accessibilityLabel={`Remove ${rate.code}`}
                    onPress={() => handleRemoveExchangeRate(rate.code)}
                    style={({ pressed }) => [styles.iconButton, pressed && styles.locationOptionPressed]}
                  >
                    <Ionicons name="remove" size={18} color={colors.mutedText} />
                  </Pressable>
                </View>
              ))}
            </View>

            {hiddenExchangeRates.length ? (
              <View style={styles.addCitySection}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isAddExchangeOpen }}
                  onPress={() => setIsAddExchangeOpen((isOpen) => !isOpen)}
                  style={({ pressed }) => [styles.addCityToggle, pressed && styles.locationOptionPressed]}
                >
                  <View style={styles.addCityToggleText}>
                    <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
                    <Text style={styles.addCityTitle}>Add currency</Text>
                  </View>
                  <Ionicons
                    name={isAddExchangeOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.mutedText}
                  />
                </Pressable>

                {isAddExchangeOpen ? (
                  <View style={styles.addCurrencyGrid}>
                    {hiddenExchangeRates.map((rate) => (
                      <Pressable
                        accessibilityRole="button"
                        key={rate.code}
                        onPress={() => handleAddExchangeRate(rate.code)}
                        style={({ pressed }) => [
                          styles.addCurrencyButton,
                          pressed && styles.locationOptionPressed,
                        ]}
                      >
                        <Text style={styles.addCurrencyFlag}>{rate.flag}</Text>
                        <Text style={styles.addCityText}>{rate.code}</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        ) : null}

        <HomeFeedGroups items={homeFeedItems} />

        <HoroscopeCard />

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isPreciousMetalExpanded }}
          onPress={() => setIsPreciousMetalExpanded((isExpanded) => !isExpanded)}
          style={({ pressed }) => [
            styles.moduleCard,
            styles.goldModuleCard,
            isPreciousMetalExpanded && styles.moduleCardExpanded,
            pressed && styles.moduleCardPressed,
          ]}
        >
          <View style={[styles.moduleAccent, styles.goldModuleAccent]} />
          <View style={styles.moduleHeader}>
            <View style={[styles.cardIcon, styles.goldCardIcon]}>
              <Text style={styles.metalIcon}>{defaultPreciousMetal.symbol}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Gold Price</Text>
              <Text style={styles.cardDescription}>
                {defaultPreciousMetal.unit} {defaultPreciousMetal.name} to Nepalese Rupee
              </Text>
            </View>
            <Text style={styles.cardSideValue}>{defaultPreciousMetal.price}</Text>
            <Ionicons
              name={isPreciousMetalExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.mutedText}
            />
          </View>
        </Pressable>

        {isPreciousMetalExpanded ? (
          <View style={styles.expandedPanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Precious metals</Text>
              <Text style={styles.panelHint}>Add metals to track prices in Nepalese Rupee</Text>
            </View>

            <View style={styles.exchangeList}>
              {visiblePreciousMetalRates.map((metal) => (
                <View key={metal.code} style={styles.exchangeRow}>
                  <View style={styles.metalBadge}>
                    <Text style={styles.metalBadgeText}>{metal.symbol}</Text>
                  </View>
                  <View style={styles.exchangeMain}>
                    <Text style={styles.exchangeTitle}>{metal.name}</Text>
                    <Text style={styles.exchangeMeta}>
                      {metal.unit} to Nepalese Rupee
                    </Text>
                  </View>
                  <View style={styles.exchangeRowSide}>
                    <Text style={styles.exchangeValue}>{metal.price}</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.mutedText} />
                  </View>
                  <Pressable
                    accessibilityLabel={`Remove ${metal.name}`}
                    onPress={() => handleRemovePreciousMetal(metal.code)}
                    style={({ pressed }) => [styles.iconButton, pressed && styles.locationOptionPressed]}
                  >
                    <Ionicons name="remove" size={18} color={colors.mutedText} />
                  </Pressable>
                </View>
              ))}
            </View>

            {hiddenPreciousMetalRates.length ? (
              <View style={styles.addCitySection}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isAddPreciousMetalOpen }}
                  onPress={() => setIsAddPreciousMetalOpen((isOpen) => !isOpen)}
                  style={({ pressed }) => [styles.addCityToggle, pressed && styles.locationOptionPressed]}
                >
                  <View style={styles.addCityToggleText}>
                    <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
                    <Text style={styles.addCityTitle}>Add metal</Text>
                  </View>
                  <Ionicons
                    name={isAddPreciousMetalOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.mutedText}
                  />
                </Pressable>

                {isAddPreciousMetalOpen ? (
                  <View style={styles.addCurrencyGrid}>
                    {hiddenPreciousMetalRates.map((metal) => (
                      <Pressable
                        accessibilityRole="button"
                        key={metal.code}
                        onPress={() => handleAddPreciousMetal(metal.code)}
                        style={({ pressed }) => [
                          styles.addCurrencyButton,
                          pressed && styles.locationOptionPressed,
                        ]}
                      >
                        <Text style={styles.addCityText}>{metal.symbol}</Text>
                        <Text style={styles.addCityText}>{metal.name}</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>
            ) : null}

            {goldVendors.length ? (
              <View style={styles.vendorSection}>
                <View style={styles.panelHeader}>
                  <Text style={styles.panelTitle}>Vendors</Text>
                  <Text style={styles.panelHint}>Call vendors to buy and find the local price</Text>
                </View>

                <View style={styles.vendorList}>
                  {goldVendors.map((vendor) => (
                    <View key={vendor.id} style={styles.vendorRow}>
                      <View style={styles.vendorMain}>
                        <Text style={styles.vendorName}>{vendor.name}</Text>
                        <Text style={styles.vendorPhone}>{vendor.phone}</Text>
                      </View>
                      <Pressable
                        accessibilityLabel={`Call ${vendor.name}`}
                        onPress={() => handleCallVendor(vendor.phone)}
                        style={({ pressed }) => [styles.callButton, pressed && styles.locationOptionPressed]}
                      >
                        <Ionicons name="call" size={20} color={colors.primary} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        ) : null}

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
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
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
  timeModuleCard: {
    borderColor: '#7DD3FC',
    backgroundColor: '#F7FCFF',
  },
  exchangeModuleCard: {
    borderColor: '#A5B4FC',
    backgroundColor: '#F8FAFF',
  },
  goldModuleCard: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFCF2',
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
  timeModuleAccent: {
    backgroundColor: '#0284C7',
  },
  exchangeModuleAccent: {
    backgroundColor: '#4F46E5',
  },
  goldModuleAccent: {
    backgroundColor: '#D97706',
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
  timeCardIcon: {
    backgroundColor: '#E0F2FE',
  },
  exchangeCardIcon: {
    backgroundColor: '#E0E7FF',
  },
  goldCardIcon: {
    backgroundColor: '#FEF3C7',
  },
  flagIcon: {
    fontSize: 24,
    lineHeight: 30,
  },
  metalIcon: {
    color: avatarAccent,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
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
  cardDescription: {
    color: colors.mutedText,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  cardSideValue: {
    color: avatarAccent,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
  },
  expandedPanel: {
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  panelHeader: {
    gap: spacing.xs,
  },
  panelTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  panelHint: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  cityList: {
    gap: spacing.xs,
  },
  cityRow: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  cityRowSelected: {
    borderColor: '#BFDBFE',
    backgroundColor: colors.surface,
  },
  cityRowMain: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  cityImage: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
  },
  cityImageFallback: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
  },
  cityName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  cityNameSelected: {
    color: colors.primary,
  },
  cityWeather: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  cityRowSide: {
    minWidth: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
  },
  cityTime: {
    color: avatarAccent,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
  },
  iconButton: {
    width: 30,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  addCitySection: {
    gap: spacing.sm,
  },
  addCityToggle: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  addCityToggleText: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addCityTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  addCityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  addCityButton: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  addCityText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  cityDetail: {
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: radius.md,
    backgroundColor: '#F0FDF4',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  exchangeList: {
    gap: spacing.xs,
  },
  exchangeRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  exchangeFlag: {
    width: 34,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
  },
  metalBadge: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
  },
  metalBadgeText: {
    color: avatarAccent,
    fontSize: 13,
    fontWeight: '900',
  },
  vendorSection: {
    gap: spacing.md,
  },
  vendorList: {
    gap: spacing.xs,
  },
  vendorRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  vendorMain: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  vendorName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  vendorPhone: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  callButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
  },
  exchangeMain: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  exchangeTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  exchangeMeta: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 16,
  },
  exchangeRowSide: {
    minWidth: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
  },
  exchangeValue: {
    color: avatarAccent,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
  },
  addCurrencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  addCurrencyButton: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  addCurrencyFlag: {
    fontSize: 16,
    lineHeight: 20,
  },
  placeholderCard: {
    minHeight: 74,
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
  },
  placeholderTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  placeholderText: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
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
