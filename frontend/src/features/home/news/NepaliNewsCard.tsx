import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { colors, radius, spacing } from '../../../constants/theme';
import { nepaliNewsItems, type NepaliNewsItem } from '../homeData';

const accent = '#7C3AED';
const border = '#C4B5FD';
const collapsedHeadlineCount = 3;

export function NepaliNewsCard() {
  const [expandedNewsId, setExpandedNewsId] = useState<string | null>(null);
  const { height } = useWindowDimensions();
  const expandedCardMaxHeight = Math.round(height * 0.85);
  const readerMaxHeight = Math.max(300, expandedCardMaxHeight - 170);
  const [isShowingMore, setIsShowingMore] = useState(false);
  const displayedNews = isShowingMore ? nepaliNewsItems : nepaliNewsItems.slice(0, collapsedHeadlineCount);
  const remainingNewsCount = Math.max(0, nepaliNewsItems.length - collapsedHeadlineCount);
  const isReading = expandedNewsId !== null;

  return (
    <View style={[styles.card, (isReading || isShowingMore) && { maxHeight: expandedCardMaxHeight }]}>
      <View style={styles.accent} />

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="newspaper-outline" size={22} color={accent} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Nepali News</Text>
          <Text style={styles.headerMeta}>{nepaliNewsItems.length} headlines</Text>
        </View>
      </View>

      <ScrollView
        nestedScrollEnabled
        persistentScrollbar
        style={[styles.rowsScroll, (isReading || isShowingMore) && { maxHeight: readerMaxHeight }]}
        contentContainerStyle={styles.rows}
      >
        {displayedNews.map((news) => (
          <NewsRow
            isExpanded={expandedNewsId === news.id}
            key={news.id}
            news={news}
            onOpen={() => Linking.openURL(news.url)}
            onToggle={() => setExpandedNewsId((currentId) => (currentId === news.id ? null : news.id))}
          />
        ))}
      </ScrollView>

      {remainingNewsCount ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isShowingMore }}
          onPress={() => setIsShowingMore((showingMore) => !showingMore)}
          style={({ pressed }) => [styles.moreButton, pressed && styles.pressed]}
        >
          <Text style={styles.moreText}>
            {isShowingMore ? 'Show less' : `Show ${remainingNewsCount} more`}
          </Text>
          <Ionicons
            name={isShowingMore ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={accent}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

function NewsRow({
  isExpanded,
  news,
  onOpen,
  onToggle,
}: {
  isExpanded: boolean;
  news: NepaliNewsItem;
  onOpen: () => void;
  onToggle: () => void;
}) {
  return (
    <View style={styles.rowBlock}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        onPress={onToggle}
        style={({ pressed }) => [styles.newsRow, pressed && styles.pressed]}
      >
        <View style={styles.newsIcon}>
          <Ionicons name="newspaper-outline" size={24} color={accent} />
        </View>
        <View style={styles.newsMain}>
          <Text style={styles.newsTitle}>{news.title}</Text>
          <Text style={styles.newsMeta}>
            {news.source} · {news.category}
          </Text>
          <Text style={styles.newsDate}>{news.publishedLabel}</Text>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.mutedText}
        />
      </Pressable>

      {isExpanded ? (
        <View style={styles.detailPanel}>
          <View style={styles.readerHeader}>
            <Text style={styles.readerTitle}>{news.title}</Text>
            <Text style={styles.readerMeta}>
              {news.source} · {news.category} · {news.publishedLabel}
            </Text>
          </View>
          <View style={styles.readerContent}>
            <Text style={styles.summaryText}>{news.summary}</Text>
            <Pressable
              accessibilityRole="link"
              onPress={onOpen}
              style={({ pressed }) => [styles.openArticleButton, pressed && styles.pressed]}
            >
              <Ionicons name="open-outline" size={17} color={accent} />
              <Text style={styles.openArticleText}>Read on Onlinekhabar</Text>
            </Pressable>
          </View>
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
  headerText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
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
    maxHeight: 390,
  },
  rowBlock: {
    gap: spacing.sm,
  },
  newsRow: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  newsIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: border,
    borderRadius: radius.sm,
    backgroundColor: '#EDE9FE',
  },
  newsMain: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  newsTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 18,
  },
  newsMeta: {
    color: accent,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  newsDate: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 15,
  },
  detailPanel: {
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  readerHeader: {
    gap: spacing.xs,
  },
  readerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 25,
  },
  readerMeta: {
    color: accent,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
  },
  readerContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  summaryText: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 21,
  },
  openArticleButton: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: border,
    borderRadius: radius.md,
    backgroundColor: '#F5F3FF',
  },
  openArticleText: {
    color: accent,
    fontSize: 13,
    fontWeight: '900',
  },
  moreButton: {
    minHeight: 38,
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
