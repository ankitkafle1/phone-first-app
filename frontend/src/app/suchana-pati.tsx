import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';
import { noticePosts, type NoticeType } from '../features/home/homeData';

export default function SuchanaPatiScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | NoticeType>('All');

  const noticeTypes = useMemo(
    () => ['All', ...Array.from(new Set(noticePosts.map((notice) => notice.noticeType)))] as const,
    [],
  );
  const filteredNotices = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return noticePosts.filter((notice) => {
      const searchableText = [
        notice.title,
        notice.noticeType,
        notice.location,
        notice.dateLabel,
        notice.organizer,
        notice.description,
      ]
        .join(' ')
        .toLowerCase();

      return (
        (!normalizedSearch || searchableText.includes(normalizedSearch)) &&
        (selectedType === 'All' || notice.noticeType === selectedType)
      );
    });
  }, [searchText, selectedType]);

  return (
    <Screen>
      <View style={styles.header}>
        <Link href="/people" asChild>
          <Pressable style={({ pressed }) => [styles.backButton, pressed && styles.lightPressed]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
        </Link>

        <View style={styles.titleGroup}>
          <Text style={styles.title}>Suchana Pati</Text>
          <Text style={styles.subtitle}>Announcements, events, alerts, and community notices.</Text>
        </View>
      </View>

      <View style={styles.searchPanel}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.mutedText} />
          <TextInput
            autoCapitalize="none"
            onChangeText={setSearchText}
            placeholder="Search notice, event, location"
            placeholderTextColor={colors.mutedText}
            style={styles.searchInput}
            value={searchText}
          />
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Type</Text>
          <View style={styles.filterChips}>
            {noticeTypes.map((noticeType) => (
              <Pressable
                accessibilityRole="button"
                key={noticeType}
                onPress={() => setSelectedType(noticeType)}
                style={({ pressed }) => [
                  styles.filterChip,
                  selectedType === noticeType && styles.filterChipSelected,
                  pressed && styles.lightPressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedType === noticeType && styles.filterChipTextSelected,
                  ]}
                >
                  {noticeType}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.noticeList}>
        {filteredNotices.map((notice) => (
          <View key={notice.id} style={styles.noticeCard}>
            <View style={styles.noticeIcon}>
              <Ionicons
                name={notice.noticeType === 'Event' ? 'calendar-outline' : 'megaphone-outline'}
                size={22}
                color={colors.primary}
              />
            </View>
            <View style={styles.noticeBody}>
              <View style={styles.noticeTopRow}>
                <View style={styles.noticeTitleGroup}>
                  <Text style={styles.noticeTitle}>{notice.title}</Text>
                  <Text style={styles.noticeMeta}>
                    {notice.noticeType} · {notice.location}
                  </Text>
                </View>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateBadgeText}>{notice.dateLabel}</Text>
                </View>
              </View>
              <Text style={styles.organizerText}>{notice.organizer}</Text>
              <Text style={styles.descriptionText}>{notice.description}</Text>
            </View>
          </View>
        ))}
        {!filteredNotices.length ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matching notices</Text>
            <Text style={styles.emptyText}>Try another type, location, or search text.</Text>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
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
  titleGroup: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  searchPanel: {
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  searchBox: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: colors.text,
    fontSize: 15,
  },
  filterGroup: {
    gap: spacing.sm,
  },
  filterLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  filterChipSelected: {
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
  },
  filterChipText: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '800',
  },
  filterChipTextSelected: {
    color: colors.primary,
  },
  noticeList: {
    gap: spacing.md,
  },
  noticeCard: {
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  noticeIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
  },
  noticeBody: {
    flex: 1,
    minWidth: 0,
    gap: spacing.sm,
  },
  noticeTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  noticeTitleGroup: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  noticeTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  noticeMeta: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  dateBadge: {
    maxWidth: 96,
    minHeight: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
  },
  dateBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  organizerText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
  descriptionText: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
  emptyState: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  lightPressed: {
    opacity: 0.72,
  },
});
