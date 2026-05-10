import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../../constants/theme';
import {
  nepaliCalendarWeekdayLabels,
  nepaliCalendarWeekdays,
  placeholderNepaliCalendarMonth,
} from './nepaliCalendarData';

export function NepaliCalendarDropdown() {
  const [isEventListExpanded, setIsEventListExpanded] = useState(false);
  const startOffset = nepaliCalendarWeekdays.indexOf(
    placeholderNepaliCalendarMonth.days[0]?.weekday_ne ?? nepaliCalendarWeekdays[0],
  );

  return (
    <View style={styles.panel}>
      <View style={styles.toolbar}>
        <Pressable style={({ pressed }) => [styles.todayButton, pressed && styles.pressed]}>
          <Text style={styles.todayText}>आज</Text>
        </Pressable>
        <View style={styles.monthTitle}>
          <Text style={styles.monthTitleText}>
            {placeholderNepaliCalendarMonth.year} {placeholderNepaliCalendarMonth.month.name_ne}
          </Text>
          <Text style={styles.monthRange}>Apr/May 2024</Text>
        </View>
      </View>

      <View style={styles.calendarBox}>
        <View style={styles.calendarGrid}>
          {nepaliCalendarWeekdays.map((weekday) => (
            <View key={weekday} style={styles.weekday}>
              <Text style={styles.weekdayNe}>{nepaliCalendarWeekdayLabels[weekday].ne}</Text>
              <Text style={styles.weekdayEn}>{nepaliCalendarWeekdayLabels[weekday].en}</Text>
            </View>
          ))}

          {Array.from({ length: Math.max(startOffset, 0) }).map((_, index) => (
            <View key={`empty-${index}`} style={styles.emptyDay} />
          ))}

          {placeholderNepaliCalendarMonth.days.map((day) => (
            <View key={day.bs_day} style={[styles.day, day.color === 'red' && styles.dayRed]}>
              <View style={styles.dayCenter}>
                <Text style={[styles.dayNumber, day.color === 'red' && styles.dayNumberRed]}>
                  {day.bs_day_ne}
                </Text>
              </View>
              <View style={styles.dayBottom}>
                <Text style={[styles.gregorianDay, day.color === 'red' && styles.gregorianDayRed]}>
                  {day.gregorian_date.slice(8)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.eventSection}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isEventListExpanded }}
          onPress={() => setIsEventListExpanded((isExpanded) => !isExpanded)}
          style={({ pressed }) => [styles.eventToggle, pressed && styles.pressed]}
        >
          <Text style={styles.eventTitle}>महत्वपूर्ण दिनहरू</Text>
          <Ionicons
            name={isEventListExpanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.mutedText}
          />
        </Pressable>

        {isEventListExpanded
          ? placeholderNepaliCalendarMonth.days
              .filter((day) => day.events.length)
              .map((day) => (
                <View key={`event-${day.bs_day}`} style={styles.eventRow}>
                  <Text style={[styles.eventDateText, day.color === 'red' && styles.eventDateTextRed]}>
                    {day.bs_day_ne}
                  </Text>
                  <Text style={styles.eventText}>{day.events.join(' · ')}</Text>
                </View>
              ))
          : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing.md,
    marginHorizontal: -spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  toolbar: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  todayButton: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: '#F8FAFC',
  },
  todayText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.82,
    backgroundColor: '#EFF6FF',
  },
  monthTitle: {
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-end',
    gap: 2,
  },
  monthTitleText: {
    color: '#B91C1C',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
  },
  monthRange: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  calendarBox: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weekday: {
    width: '14.285%',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  weekdayNe: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 16,
  },
  weekdayEn: {
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 13,
  },
  emptyDay: {
    width: '14.285%',
    aspectRatio: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  day: {
    width: '14.285%',
    aspectRatio: 1,
    justifyContent: 'center',
    padding: 3,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  dayRed: {
    backgroundColor: '#FFF8F8',
  },
  dayCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayNumber: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 29,
  },
  dayNumberRed: {
    color: '#DC2626',
  },
  dayBottom: {
    alignItems: 'center',
  },
  gregorianDay: {
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 14,
  },
  gregorianDayRed: {
    color: '#DC2626',
  },
  eventSection: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  eventToggle: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  eventTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: '#FFFFFF',
  },
  eventDateText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  eventDateTextRed: {
    color: '#DC2626',
  },
  eventText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
});
