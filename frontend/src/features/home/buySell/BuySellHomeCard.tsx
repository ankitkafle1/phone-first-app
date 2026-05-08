import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../../../constants/theme';
import type { HomeBuySellPreview } from '../homeData';

type BuySellHomeCardProps = {
  isExpanded: boolean;
  item: HomeBuySellPreview;
  onToggle: () => void;
};

export function BuySellHomeCard({ isExpanded, item, onToggle }: BuySellHomeCardProps) {
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
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: item.photo }}
            style={styles.previewImage}
          />
          <View style={styles.previewMain}>
            <Text style={styles.previewName}>{item.title}</Text>
            <Text style={styles.previewMeta}>
              {item.category} · {item.price}
            </Text>
            <Text style={styles.previewInfo}>{item.location}</Text>
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
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: item.photo }}
            style={styles.detailImage}
          />
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>{item.title}</Text>
            <Text style={styles.panelHint}>
              {item.category} · {item.condition} · {item.price} · {item.location}
            </Text>
          </View>
          <Text style={styles.detailText}>{item.description}</Text>
          <View style={styles.actionRow}>
            <Pressable
              accessibilityLabel={`Call seller for ${item.title}`}
              onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)}
              style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
            >
              <Ionicons name="call" size={18} color={colors.primary} />
              <Text style={styles.actionText}>{item.phoneNumber}</Text>
            </Pressable>
            <Link href="/buy-sell" asChild>
              <Pressable style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
                <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
                <Text style={styles.actionText}>Open Buy & Sell</Text>
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
    borderColor: '#FDE68A',
    borderRadius: radius.md,
    backgroundColor: '#FFFBEB',
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
    borderColor: '#FDE68A',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  previewImage: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
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
    color: '#A16207',
    fontSize: 12,
    fontWeight: '800',
  },
  previewInfo: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
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
