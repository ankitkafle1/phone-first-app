import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../../../constants/theme';
import { defaultHomePreferences, nepaliHoroscopes } from '../homeData';

const avatarAccent = '#003577';

export function HoroscopeCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const defaultHoroscope =
    nepaliHoroscopes.find((horoscope) => horoscope.id === defaultHomePreferences.horoscopeId) ??
    nepaliHoroscopes[0];

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        onPress={() => setIsExpanded((expanded) => !expanded)}
        style={({ pressed }) => [
          styles.moduleCard,
          isExpanded && styles.moduleCardExpanded,
          pressed && styles.moduleCardPressed,
        ]}
      >
        <View style={styles.moduleAccent} />
        <View style={styles.moduleHeader}>
          <View style={styles.cardIcon}>
            <Text style={styles.horoscopeIcon}>{defaultHoroscope.symbol}</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>आजको राशिफल</Text>
            <Text style={styles.cardDescription}>
              {defaultHoroscope.name} · {defaultHoroscope.summary}
            </Text>
          </View>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.mutedText}
          />
        </View>
      </Pressable>

      {isExpanded ? (
        <View style={styles.expandedPanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>सबै राशिफल</Text>
          </View>

          <View style={styles.horoscopeList}>
            {nepaliHoroscopes.map((horoscope) => (
              <View key={horoscope.id} style={styles.horoscopeRow}>
                <Text style={styles.horoscopeSymbol}>{horoscope.symbol}</Text>
                <View style={styles.horoscopeMain}>
                  <Text style={styles.horoscopeTitle}>
                    {horoscope.name} · {horoscope.englishName}
                  </Text>
                  <Text style={styles.horoscopeSummary}>{horoscope.summary}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  moduleCard: {
    minHeight: 82,
    padding: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#C4B5FD',
    borderRadius: radius.md,
    backgroundColor: '#FBFAFF',
  },
  moduleAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: '#7C3AED',
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
    backgroundColor: '#EDE9FE',
  },
  horoscopeIcon: {
    color: avatarAccent,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
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
  horoscopeList: {
    gap: spacing.xs,
  },
  horoscopeRow: {
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  horoscopeSymbol: {
    width: 34,
    color: avatarAccent,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
    textAlign: 'center',
    paddingTop: 2,
  },
  horoscopeMain: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  horoscopeTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  horoscopeSummary: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
});
