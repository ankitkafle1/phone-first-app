import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../../../constants/theme';
import {
  cityCatalog,
  cityImageUrls,
  defaultHomePreferences,
  formatDate,
  formatTime,
} from '../homeData';

const avatarAccent = '#003577';

export function CityTimeCard() {
  const [now, setNow] = useState(() => new Date());
  const [visibleCityIds, setVisibleCityIds] = useState(defaultHomePreferences.timeCityIds);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [isAddCityOpen, setIsAddCityOpen] = useState(false);
  const visibleCities = cityCatalog.filter((city) => visibleCityIds.includes(city.id));
  const hiddenCities = cityCatalog.filter((city) => !visibleCityIds.includes(city.id));

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  function handleRemoveCity(cityId: string) {
    setVisibleCityIds((cityIds) => cityIds.filter((id) => id !== cityId));

    if (selectedCityId === cityId) {
      setSelectedCityId(null);
    }
  }

  function handleAddCity(cityId: string) {
    setVisibleCityIds((cityIds) => [...cityIds, cityId]);
    setIsAddCityOpen(false);
  }

  return (
    <View style={styles.card}>
      <View style={styles.accent} />

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="time-outline" size={24} color="#0284C7" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>City Time</Text>
          <Text style={styles.headerMeta}>{visibleCities.length} cities</Text>
        </View>
      </View>

      <View style={styles.rows}>
        {visibleCities.map((city) => {
          const isSelected = selectedCityId === city.id;

          return (
            <View key={city.id} style={styles.rowBlock}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: isSelected }}
                onPress={() => setSelectedCityId(isSelected ? null : city.id)}
                style={({ pressed }) => [
                  styles.cityRow,
                  isSelected && styles.cityRowSelected,
                  pressed && styles.pressed,
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
                    <Ionicons name="time-outline" size={22} color={colors.primary} />
                  </View>
                )}
                <View style={styles.cityMain}>
                  <Text style={styles.cityName}>
                    {city.city}, {city.countryCode}
                  </Text>
                  <Text style={styles.cityWeather}>
                    {city.temperature} · {city.weather}
                  </Text>
                </View>
                <View style={styles.citySide}>
                  <Text style={styles.cityTime}>{formatTime(now, city.timeZone)}</Text>
                  <Ionicons
                    name={isSelected ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.mutedText}
                  />
                </View>
                <Pressable
                  accessibilityLabel={`Remove ${city.city}`}
                  onPress={() => handleRemoveCity(city.id)}
                  style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
                >
                  <Ionicons name="remove" size={18} color={colors.mutedText} />
                </Pressable>
              </Pressable>

              {isSelected ? (
                <View style={styles.cityDetail}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                    <Text style={styles.detailText}>{formatDate(now, city.timeZone)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="partly-sunny-outline" size={18} color={colors.primary} />
                    <Text style={styles.detailText}>
                      {city.temperature} · {city.weather}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {hiddenCities.length ? (
        <View style={styles.addCitySection}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: isAddCityOpen }}
            onPress={() => setIsAddCityOpen((isOpen) => !isOpen)}
            style={({ pressed }) => [styles.addCityToggle, pressed && styles.pressed]}
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
              {hiddenCities.map((city) => (
                <Pressable
                  accessibilityRole="button"
                  key={city.id}
                  onPress={() => handleAddCity(city.id)}
                  style={({ pressed }) => [styles.addCityButton, pressed && styles.pressed]}
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    overflow: 'hidden',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#7DD3FC',
    borderRadius: radius.md,
    backgroundColor: '#F7FCFF',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: '#0284C7',
  },
  header: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#7DD3FC',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  headerMeta: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '800',
  },
  rows: {
    gap: spacing.sm,
  },
  rowBlock: {
    gap: spacing.sm,
  },
  cityRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  cityRowSelected: {
    borderColor: '#7DD3FC',
    backgroundColor: '#F0F9FF',
  },
  pressed: {
    backgroundColor: '#F1F5F9',
  },
  cityImage: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: radius.sm,
    backgroundColor: '#E0F2FE',
  },
  cityImageFallback: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: radius.sm,
    backgroundColor: '#E0F2FE',
  },
  cityMain: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  cityName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  cityWeather: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  citySide: {
    minWidth: 96,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  cityTime: {
    color: avatarAccent,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
  },
  iconButton: {
    width: 28,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  cityDetail: {
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: radius.md,
    backgroundColor: '#F0F9FF',
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
    borderColor: '#BAE6FD',
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
    borderColor: '#BAE6FD',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  addCityText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
});
