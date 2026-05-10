import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../../../constants/theme';
import type { HomeKathaKabitaPreview } from '../homeData';

type KathaKabitaHomeCardProps = {
  isExpanded: boolean;
  item: HomeKathaKabitaPreview;
  onToggle: () => void;
};

export function KathaKabitaHomeCard({ isExpanded, item, onToggle }: KathaKabitaHomeCardProps) {
  return (
    <View style={styles.homeInfoGroup}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        onPress={onToggle}
        style={({ pressed }) => [
          styles.card,
          isExpanded && styles.cardExpanded,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={styles.previewRow}>
          <View style={styles.previewIcon}>
            <Ionicons name="book-outline" size={24} color="#7C3AED" />
          </View>
          <View style={styles.previewMain}>
            <Text style={styles.previewName}>{item.title}</Text>
            <Text style={styles.previewMeta}>
              {item.writer} · {item.publishedDate}
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
            <Text style={styles.panelTitle}>{item.title}</Text>
            <Text style={styles.panelHint}>
              {item.contentType} · {item.writer} · {item.publishedDate}
            </Text>
          </View>
          <ScrollView
            nestedScrollEnabled
            persistentScrollbar
            style={styles.writingScroll}
            contentContainerStyle={styles.writingScrollContent}
          >
            <Text style={styles.writingText}>{item.excerpt}</Text>
          </ScrollView>
          <View style={styles.actionRow}>
            <View style={styles.actionButton}>
              <Ionicons name="heart-outline" size={18} color={colors.primary} />
              <Text style={styles.actionText}>{item.likeCount} likes</Text>
            </View>
            <Link href="/katha-kabita" asChild>
              <Pressable style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
                <Ionicons name="book-outline" size={18} color={colors.primary} />
                <Text style={styles.actionText}>Open Katha Kabita</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  homeInfoGroup: {
    gap: spacing.sm,
  },
  card: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#C4B5FD',
    borderRadius: radius.md,
    backgroundColor: '#F5F3FF',
  },
  cardExpanded: {
    borderColor: '#93C5FD',
    backgroundColor: '#F8FBFF',
  },
  cardPressed: {
    backgroundColor: '#F1F5F9',
  },
  previewRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  previewIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: '#EDE9FE',
  },
  previewMain: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  previewName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  previewMeta: {
    color: '#7C3AED',
    fontSize: 12,
    fontWeight: '800',
  },
  expandedPanel: {
    gap: spacing.md,
    minHeight: 440,
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
  writingScroll: {
    maxHeight: 560,
    minHeight: 360,
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
  pressed: {
    opacity: 0.72,
  },
});
