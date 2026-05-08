import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { colors, radius, spacing } from '../../../constants/theme';
import type {
  HomeBuySellPreview,
  HomeFeedItem,
  HomeKathaKabitaPreview,
  HomeRoomPreview,
  SuchanaPatiPreview,
} from '../homeData';

type FeedKind = HomeFeedItem['kind'];

type HomeFeedGroupsProps = {
  items: HomeFeedItem[];
};

const collapsedItemCount = 3;

const groupConfig: Record<
  FeedKind,
  {
    accent: string;
    background: string;
    border: string;
    icon: keyof typeof Ionicons.glyphMap;
    route: '/nepali-business' | '/rooms' | '/buy-sell' | '/katha-kabita';
    title: string;
  }
> = {
  room: {
    accent: '#16A34A',
    background: '#F0FDF4',
    border: '#86EFAC',
    icon: 'home-outline',
    route: '/rooms',
    title: 'Rooms',
  },
  suchana: {
    accent: '#EA580C',
    background: '#FFF7ED',
    border: '#FDBA74',
    icon: 'newspaper-outline',
    route: '/nepali-business',
    title: 'Nepali Business',
  },
  'katha-kabita': {
    accent: '#7C3AED',
    background: '#F5F3FF',
    border: '#C4B5FD',
    icon: 'book-outline',
    route: '/katha-kabita',
    title: 'Katha Kabita',
  },
  'buy-sell': {
    accent: '#A16207',
    background: '#FFFBEB',
    border: '#FDE68A',
    icon: 'pricetag-outline',
    route: '/buy-sell',
    title: 'Buy & Sell',
  },
};

const groupOrder: FeedKind[] = ['room', 'suchana', 'katha-kabita', 'buy-sell'];

export function HomeFeedGroups({ items }: HomeFeedGroupsProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const { height } = useWindowDimensions();
  const expandedGroupMaxHeight = Math.round(height * 0.85);
  const expandedRowsMaxHeight = Math.max(260, expandedGroupMaxHeight - 150);
  const groups = groupOrder
    .map((kind) => ({
      kind,
      items: items.filter((item) => item.kind === kind),
    }))
    .filter((group) => group.items.length);

  if (!groups.length) {
    return null;
  }

  return (
    <>
      {groups.map((group) => {
        const config = groupConfig[group.kind];
        const isGroupExpanded = expandedGroups[group.kind] ?? false;
        const visibleItems = isGroupExpanded
          ? group.items
          : group.items.slice(0, collapsedItemCount);
        const hasMore = group.items.length > collapsedItemCount;

        return (
          <View
            key={group.kind}
            style={[
              styles.groupCard,
              { backgroundColor: config.background, borderColor: config.border },
              isGroupExpanded && { maxHeight: expandedGroupMaxHeight },
            ]}
          >
            <View style={[styles.groupAccent, { backgroundColor: config.accent }]} />
            <View style={styles.groupHeader}>
              <View style={[styles.groupIcon, { borderColor: config.border }]}>
                <Ionicons name={config.icon} size={22} color={config.accent} />
              </View>
              <View style={styles.groupHeaderText}>
                <Text style={styles.groupTitle}>{config.title}</Text>
                <Text style={styles.groupMeta}>{group.items.length} items</Text>
              </View>
              <Link href={config.route} asChild>
                <Pressable style={({ pressed }) => [styles.openGroupButton, pressed && styles.pressed]}>
                  <Text style={[styles.openGroupText, { color: config.accent }]}>Open</Text>
                </Pressable>
              </Link>
            </View>

            {isGroupExpanded ? (
              <ScrollView
                nestedScrollEnabled
                persistentScrollbar
                style={[styles.groupRowsScroll, { maxHeight: expandedRowsMaxHeight }]}
                contentContainerStyle={styles.groupRows}
              >
                {visibleItems.map((feedItem) => (
                  <FeedRow
                    accent={config.accent}
                    feedItem={feedItem}
                    isExpanded={expandedItemId === `${feedItem.kind}-${feedItem.id}`}
                    key={`${feedItem.kind}-${feedItem.id}`}
                    onToggle={() => {
                      const id = `${feedItem.kind}-${feedItem.id}`;
                      setExpandedItemId((currentId) => (currentId === id ? null : id));
                    }}
                  />
                ))}
              </ScrollView>
            ) : (
              <View style={styles.groupRows}>
                {visibleItems.map((feedItem) => (
                  <FeedRow
                    accent={config.accent}
                    feedItem={feedItem}
                    isExpanded={expandedItemId === `${feedItem.kind}-${feedItem.id}`}
                    key={`${feedItem.kind}-${feedItem.id}`}
                    onToggle={() => {
                      const id = `${feedItem.kind}-${feedItem.id}`;
                      setExpandedItemId((currentId) => (currentId === id ? null : id));
                    }}
                  />
                ))}
              </View>
            )}

            {hasMore ? (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: isGroupExpanded }}
                onPress={() =>
                  setExpandedGroups((currentGroups) => ({
                    ...currentGroups,
                    [group.kind]: !isGroupExpanded,
                  }))
                }
                style={({ pressed }) => [styles.moreButton, pressed && styles.pressed]}
              >
                <Text style={[styles.moreText, { color: config.accent }]}>
                  {isGroupExpanded ? 'Show less' : `Show ${group.items.length - collapsedItemCount} more`}
                </Text>
                <Ionicons
                  name={isGroupExpanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={config.accent}
                />
              </Pressable>
            ) : null}
          </View>
        );
      })}
    </>
  );
}

function FeedRow({
  accent,
  feedItem,
  isExpanded,
  onToggle,
}: {
  accent: string;
  feedItem: HomeFeedItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const row = getRowContent(feedItem);

  return (
    <View style={styles.rowBlock}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        onPress={onToggle}
        style={({ pressed }) => [
          styles.feedRow,
          { borderColor: row.borderColor },
          pressed && styles.rowPressed,
        ]}
      >
        {row.imageUrl ? (
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: row.imageUrl }}
            style={[styles.rowImage, { borderColor: row.borderColor }]}
          />
        ) : (
          <View style={[styles.rowIcon, { backgroundColor: row.iconBackground }]}>
            <Ionicons name={row.icon} size={24} color={accent} />
          </View>
        )}
        <View style={styles.rowMain}>
          <Text style={styles.rowTitle}>{row.title}</Text>
          <Text style={[styles.rowMeta, { color: accent }]}>{row.meta}</Text>
          {row.info ? <Text style={styles.rowInfo}>{row.info}</Text> : null}
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.mutedText}
        />
      </Pressable>

      {isExpanded ? <FeedDetail accent={accent} feedItem={feedItem} /> : null}
    </View>
  );
}

function FeedDetail({ accent, feedItem }: { accent: string; feedItem: HomeFeedItem }) {
  if (feedItem.kind === 'katha-kabita') {
    const post = feedItem.item;

    return (
      <View style={styles.detailPanel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>{post.title}</Text>
          <Text style={styles.panelHint}>
            {post.contentType} · {post.writer} · {post.publishedDate}
          </Text>
        </View>
        <ScrollView
          nestedScrollEnabled
          persistentScrollbar
          style={styles.writingScroll}
          contentContainerStyle={styles.writingScrollContent}
        >
          <Text style={styles.writingText}>{post.excerpt}</Text>
        </ScrollView>
        <View style={styles.actionRow}>
          <View style={styles.actionButton}>
            <Ionicons name="heart-outline" size={18} color={colors.primary} />
            <Text style={styles.actionText}>{post.likeCount} likes</Text>
          </View>
          <Link href="/katha-kabita" asChild>
            <Pressable style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
              <Ionicons name="book-outline" size={18} color={colors.primary} />
              <Text style={styles.actionText}>Open Katha Kabita</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    );
  }

  const detail = getDetailContent(feedItem);

  return (
    <View style={styles.detailPanel}>
      {detail.imageUrl ? (
        <Image
          accessibilityIgnoresInvertColors
          source={{ uri: detail.imageUrl }}
          style={styles.detailImage}
        />
      ) : null}
      <View style={styles.panelHeader}>
        <Text style={styles.panelTitle}>{detail.title}</Text>
        <Text style={styles.panelHint}>{detail.meta}</Text>
      </View>
      <Text style={styles.detailText}>{detail.description}</Text>
      <View style={styles.actionRow}>
        <Pressable
          accessibilityLabel={`Call ${detail.title}`}
          onPress={() => Linking.openURL(`tel:${detail.phoneNumber}`)}
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
        >
          <Ionicons name="call" size={18} color={colors.primary} />
          <Text style={styles.actionText}>{detail.phoneNumber}</Text>
        </Pressable>
        <Link href={detail.route} asChild>
          <Pressable style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
            <Ionicons name={detail.routeIcon} size={18} color={colors.primary} />
            <Text style={styles.actionText}>{detail.routeLabel}</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

function getRowContent(feedItem: HomeFeedItem) {
  if (feedItem.kind === 'room') {
    const item = feedItem.item as HomeRoomPreview;
    return {
      borderColor: '#BBF7D0',
      icon: 'home-outline' as const,
      iconBackground: '#DCFCE7',
      imageUrl: item.photo,
      info: item.location,
      meta: `${item.listingType} · ${item.price}`,
      title: item.title,
    };
  }

  if (feedItem.kind === 'suchana') {
    const item = feedItem.item as SuchanaPatiPreview;
    return {
      borderColor: '#FED7AA',
      icon: 'newspaper-outline' as const,
      iconBackground: '#FFEDD5',
      imageUrl: item.photo,
      info: item.info,
      meta: `${item.category} · ${item.rating.toFixed(1)}`,
      title: item.name,
    };
  }

  if (feedItem.kind === 'buy-sell') {
    const item = feedItem.item as HomeBuySellPreview;
    return {
      borderColor: '#FDE68A',
      icon: 'pricetag-outline' as const,
      iconBackground: '#FEF3C7',
      imageUrl: item.photo,
      info: item.location,
      meta: `${item.category} · ${item.price}`,
      title: item.title,
    };
  }

  const item = feedItem.item as HomeKathaKabitaPreview;
  return {
    borderColor: '#DDD6FE',
    icon: 'book-outline' as const,
    iconBackground: '#EDE9FE',
    imageUrl: null,
    info: null,
    meta: `${item.writer} · ${item.publishedDate}`,
    title: item.title,
  };
}

function getDetailContent(feedItem: HomeFeedItem) {
  if (feedItem.kind === 'room') {
    const item = feedItem.item as HomeRoomPreview;
    return {
      description: item.description,
      imageUrl: item.photo,
      meta: `${item.listingType} · ${item.price} · ${item.location}`,
      phoneNumber: item.phoneNumber,
      route: '/rooms' as const,
      routeIcon: 'home-outline' as const,
      routeLabel: 'Open Rooms',
      title: item.title,
    };
  }

  if (feedItem.kind === 'buy-sell') {
    const item = feedItem.item as HomeBuySellPreview;
    return {
      description: item.description,
      imageUrl: item.photo,
      meta: `${item.category} · ${item.condition} · ${item.price} · ${item.location}`,
      phoneNumber: item.phoneNumber,
      route: '/buy-sell' as const,
      routeIcon: 'pricetag-outline' as const,
      routeLabel: 'Open Buy & Sell',
      title: item.title,
    };
  }

  const item = feedItem.item as SuchanaPatiPreview;
  return {
    description: item.info,
    imageUrl: item.photo,
    meta: `${item.category} · ${item.rating.toFixed(1)} rating`,
    phoneNumber: item.phoneNumber,
    route: '/nepali-business' as const,
    routeIcon: 'newspaper-outline' as const,
    routeLabel: 'Open Nepali Business',
    title: item.name,
  };
}

const styles = StyleSheet.create({
  groupCard: {
    gap: spacing.sm,
    overflow: 'hidden',
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  groupAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  groupHeader: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  groupIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  groupHeaderText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  groupTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  groupMeta: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '800',
  },
  openGroupButton: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  openGroupText: {
    fontSize: 14,
    fontWeight: '900',
  },
  groupRows: {
    gap: spacing.sm,
  },
  groupRowsScroll: {
    flexGrow: 0,
  },
  rowBlock: {
    gap: spacing.sm,
  },
  feedRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  rowPressed: {
    backgroundColor: '#F8FAFC',
  },
  rowImage: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
  },
  rowIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  rowMain: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rowTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  rowMeta: {
    fontSize: 12,
    fontWeight: '800',
  },
  rowInfo: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  detailPanel: {
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
  detailImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
  },
  detailText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  writingScroll: {
    maxHeight: 560,
    minHeight: 260,
  },
  writingScrollContent: {
    paddingRight: spacing.xs,
  },
  writingText: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 28,
  },
  actionRow: {
    gap: spacing.sm,
  },
  actionButton: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
  },
  actionText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  moreButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.sm,
  },
  moreText: {
    fontSize: 14,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.72,
  },
});
