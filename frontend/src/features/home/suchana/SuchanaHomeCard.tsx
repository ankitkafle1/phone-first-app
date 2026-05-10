import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../../../constants/theme';
import type { SuchanaPatiPreview } from '../homeData';

type SuchanaHomeCardProps = {
  isExpanded: boolean;
  item: SuchanaPatiPreview;
  onToggle: () => void;
};

export function SuchanaHomeCard({ isExpanded, item, onToggle }: SuchanaHomeCardProps) {
  return (
    <View style={styles.homeInfoGroup}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        onPress={onToggle}
        style={({ pressed }) => [
          styles.suchanaCard,
          isExpanded && styles.moduleCardExpanded,
          pressed && styles.moduleCardPressed,
        ]}
      >
        <View style={styles.suchanaPreviewRow}>
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: item.photo }}
            style={styles.suchanaPreviewImage}
          />
          <View style={styles.suchanaPreviewMain}>
            <Text style={styles.suchanaPreviewName}>{item.name}</Text>
            <Text style={styles.suchanaPreviewMeta}>
              {item.category} · {item.rating.toFixed(1)}
            </Text>
            <Text style={styles.suchanaPreviewInfo}>{item.info}</Text>
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
            style={styles.suchanaDetailImage}
          />
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>{item.name}</Text>
            <Text style={styles.panelHint}>
              {item.category} · {item.rating.toFixed(1)} rating
            </Text>
          </View>
          <Text style={styles.suchanaDetailText}>{item.info}</Text>
          <View style={styles.suchanaActionRow}>
            <Pressable
              accessibilityLabel={`Call ${item.name}`}
              onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)}
              style={({ pressed }) => [styles.suchanaActionButton, pressed && styles.brandPressed]}
            >
              <Ionicons name="call" size={18} color={colors.primary} />
              <Text style={styles.suchanaActionText}>{item.phoneNumber}</Text>
            </Pressable>
            <Link href="/nepali-business" asChild>
              <Pressable style={({ pressed }) => [styles.suchanaActionButton, pressed && styles.brandPressed]}>
                <Ionicons name="newspaper-outline" size={18} color={colors.primary} />
                <Text style={styles.suchanaActionText}>Open Nepali Business</Text>
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
  suchanaCard: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FDBA74',
    borderRadius: radius.md,
    backgroundColor: '#FFF7ED',
  },
  moduleCardExpanded: {
    borderColor: '#93C5FD',
    backgroundColor: '#F8FBFF',
  },
  moduleCardPressed: {
    backgroundColor: '#F1F5F9',
  },
  suchanaPreviewRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  suchanaPreviewImage: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
  },
  suchanaPreviewMain: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  suchanaPreviewName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  suchanaPreviewMeta: {
    color: '#C2410C',
    fontSize: 12,
    fontWeight: '800',
  },
  suchanaPreviewInfo: {
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
  suchanaDetailImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
  },
  suchanaDetailText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  suchanaActionRow: {
    gap: spacing.sm,
  },
  suchanaActionButton: {
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
  suchanaActionText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  brandPressed: {
    opacity: 0.72,
  },
});
