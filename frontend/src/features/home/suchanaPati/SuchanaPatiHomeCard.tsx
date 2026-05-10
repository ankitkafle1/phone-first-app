import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors, radius, spacing } from '../../../constants/theme';
import { noticePosts, type NoticePost, type NoticeType } from '../homeData';

const collapsedItemCount = 3;
const accent = '#0EA5E9';
const border = '#7DD3FC';

export function SuchanaPatiHomeCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);
  const { height } = useWindowDimensions();
  const expandedCardMaxHeight = Math.round(height * 0.85);
  const rowsMaxHeight = Math.max(260, expandedCardMaxHeight - 150);
  const visibleNotices = isExpanded ? noticePosts : noticePosts.slice(0, collapsedItemCount);
  const hiddenCount = Math.max(0, noticePosts.length - collapsedItemCount);

  return (
    <View style={[styles.card, isExpanded && { maxHeight: expandedCardMaxHeight }]}>
      <View style={styles.accent} />

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="newspaper-outline" size={22} color={accent} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Suchana Pati</Text>
          <Text style={styles.headerMeta}>{noticePosts.length} notices</Text>
        </View>
        <Link href="/suchana-pati" asChild>
          <Pressable style={({ pressed }) => [styles.openButton, pressed && styles.pressed]}>
            <Text style={styles.openText}>Open</Text>
          </Pressable>
        </Link>
      </View>

      {isExpanded ? (
        <ScrollView
          nestedScrollEnabled
          persistentScrollbar
          style={[styles.rowsScroll, { maxHeight: rowsMaxHeight }]}
          contentContainerStyle={styles.rows}
        >
          {visibleNotices.map((notice) => (
            <NoticeRow
              isExpanded={expandedNoticeId === notice.id}
              key={notice.id}
              notice={notice}
              onToggle={() =>
                setExpandedNoticeId((currentId) => (currentId === notice.id ? null : notice.id))
              }
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.rows}>
          {visibleNotices.map((notice) => (
            <NoticeRow
              isExpanded={expandedNoticeId === notice.id}
              key={notice.id}
              notice={notice}
              onToggle={() =>
                setExpandedNoticeId((currentId) => (currentId === notice.id ? null : notice.id))
              }
            />
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

function NoticeRow({
  isExpanded,
  notice,
  onToggle,
}: {
  isExpanded: boolean;
  notice: NoticePost;
  onToggle: () => void;
}) {
  return (
    <View style={styles.rowBlock}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        onPress={onToggle}
        style={({ pressed }) => [styles.noticeRow, pressed && styles.pressed]}
      >
        <View style={styles.noticeIcon}>
          <Ionicons name={getNoticeIcon(notice.noticeType)} size={22} color={accent} />
        </View>
        <View style={styles.noticeMain}>
          <Text style={styles.noticeTitle}>{notice.title}</Text>
          <Text style={styles.noticeMeta}>
            {notice.noticeType} · {notice.location}
          </Text>
          <Text style={styles.noticeDate}>{notice.dateLabel}</Text>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.mutedText}
        />
      </Pressable>

      {isExpanded ? (
        <View style={styles.detailPanel}>
          <Text style={styles.organizerText}>{notice.organizer}</Text>
          <Text style={styles.descriptionText}>{notice.description}</Text>
        </View>
      ) : null}
    </View>
  );
}

function getNoticeIcon(type: NoticeType): keyof typeof Ionicons.glyphMap {
  if (type === 'Event') {
    return 'calendar-outline';
  }

  if (type === 'Alert') {
    return 'alert-circle-outline';
  }

  if (type === 'Community') {
    return 'people-outline';
  }

  return 'megaphone-outline';
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    overflow: 'hidden',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: border,
    borderRadius: radius.md,
    backgroundColor: '#F0F9FF',
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
  openButton: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  openText: {
    color: accent,
    fontSize: 14,
    fontWeight: '900',
  },
  rows: {
    gap: spacing.sm,
  },
  rowsScroll: {
    flexGrow: 0,
  },
  rowBlock: {
    gap: spacing.sm,
  },
  noticeRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  noticeIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: border,
    borderRadius: radius.sm,
    backgroundColor: '#E0F2FE',
  },
  noticeMain: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  noticeTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  noticeMeta: {
    color: accent,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  noticeDate: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  detailPanel: {
    gap: spacing.xs,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  organizerText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  descriptionText: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '700',
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
