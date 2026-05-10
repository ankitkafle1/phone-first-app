import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors, radius, spacing } from '../../../constants/theme';
import { defaultHomePreferences, nepaliHoroscopes, type NepaliHoroscope } from '../homeData';

const accent = '#7C3AED';
const border = '#C4B5FD';
const avatarAccent = '#003577';
const collapsedItemCount = 1;

export function HoroscopeCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { height } = useWindowDimensions();
  const expandedCardMaxHeight = Math.round(height * 0.85);
  const rowsMaxHeight = Math.max(260, expandedCardMaxHeight - 150);
  const defaultHoroscope =
    nepaliHoroscopes.find((horoscope) => horoscope.id === defaultHomePreferences.horoscopeId) ??
    nepaliHoroscopes[0];
  const orderedHoroscopes = [
    defaultHoroscope,
    ...nepaliHoroscopes.filter((horoscope) => horoscope.id !== defaultHoroscope.id),
  ];
  const visibleHoroscopes = isExpanded
    ? orderedHoroscopes
    : orderedHoroscopes.slice(0, collapsedItemCount);
  const hiddenCount = Math.max(0, orderedHoroscopes.length - collapsedItemCount);

  return (
    <View style={[styles.card, isExpanded && { maxHeight: expandedCardMaxHeight }]}>
      <View style={styles.accent} />

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>{defaultHoroscope.symbol}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>आजको राशिफल</Text>
          <Text style={styles.headerMeta}>{nepaliHoroscopes.length} राशि</Text>
        </View>
      </View>

      {isExpanded ? (
        <ScrollView
          nestedScrollEnabled
          persistentScrollbar
          style={[styles.rowsScroll, { maxHeight: rowsMaxHeight }]}
          contentContainerStyle={styles.rows}
        >
          {visibleHoroscopes.map((horoscope) => (
            <HoroscopeRow horoscope={horoscope} key={horoscope.id} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.rows}>
          {visibleHoroscopes.map((horoscope) => (
            <HoroscopeRow horoscope={horoscope} key={horoscope.id} />
          ))}
        </View>
      )}

      {hiddenCount ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isExpanded }}
          onPress={() => setIsExpanded((current) => !current)}
          style={({ pressed }) => [styles.moreButton, pressed && styles.pressed]}
        >
          <Text style={styles.moreText}>
            {isExpanded ? 'Show less' : `Show ${hiddenCount} more`}
          </Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={accent}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

function HoroscopeRow({ horoscope }: { horoscope: NepaliHoroscope }) {
  return (
    <View style={styles.horoscopeRow}>
      <View style={styles.horoscopeIcon}>
        <Text style={styles.horoscopeSymbol}>{horoscope.symbol}</Text>
      </View>
      <View style={styles.horoscopeMain}>
        <Text style={styles.horoscopeTitle}>
          {horoscope.name} · {horoscope.englishName}
        </Text>
        <Text style={styles.horoscopeSummary}>{horoscope.summary}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    overflow: 'hidden',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: border,
    borderRadius: radius.md,
    backgroundColor: '#F5F3FF',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: accent,
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
    borderColor: border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  headerIconText: {
    color: avatarAccent,
    fontSize: 23,
    fontWeight: '900',
    lineHeight: 30,
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
  rowsScroll: {
    flexGrow: 0,
  },
  horoscopeRow: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  horoscopeIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: border,
    borderRadius: radius.sm,
    backgroundColor: '#EDE9FE',
  },
  horoscopeSymbol: {
    color: avatarAccent,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
  },
  horoscopeMain: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  horoscopeTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  horoscopeSummary: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
  },
  moreButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.md,
  },
  moreText: {
    color: accent,
    fontSize: 14,
    fontWeight: '900',
  },
  pressed: {
    backgroundColor: '#F1F5F9',
  },
});
