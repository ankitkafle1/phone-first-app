import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../../../constants/theme';
import {
  defaultHomePreferences,
  goldVendorsByLocation,
  preciousMetalRates,
  type HomeLocation,
} from '../homeData';

const avatarAccent = '#003577';

type GoldPriceCardProps = {
  homeLocation: HomeLocation;
};

export function GoldPriceCard({ homeLocation }: GoldPriceCardProps) {
  const [visibleMetalCodes, setVisibleMetalCodes] = useState(defaultHomePreferences.preciousMetalCodes);
  const [selectedMetalCode, setSelectedMetalCode] = useState<string | null>(null);
  const [isAddMetalOpen, setIsAddMetalOpen] = useState(false);
  const visibleMetals = preciousMetalRates.filter((metal) => visibleMetalCodes.includes(metal.code));
  const hiddenMetals = preciousMetalRates.filter((metal) => !visibleMetalCodes.includes(metal.code));
  const vendors = goldVendorsByLocation[`${homeLocation.city}-${homeLocation.countryCode}`] ?? [];

  function handleRemoveMetal(code: string) {
    setVisibleMetalCodes((codes) => codes.filter((visibleCode) => visibleCode !== code));

    if (selectedMetalCode === code) {
      setSelectedMetalCode(null);
    }
  }

  function handleAddMetal(code: string) {
    setVisibleMetalCodes((codes) => [...codes, code]);
    setIsAddMetalOpen(false);
  }

  return (
    <View style={styles.card}>
      <View style={styles.accent} />

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>Au</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Gold Price</Text>
          <Text style={styles.headerMeta}>{visibleMetals.length} metals</Text>
        </View>
      </View>

      <View style={styles.rows}>
        {visibleMetals.map((metal) => {
          const isSelected = selectedMetalCode === metal.code;

          return (
            <View key={metal.code} style={styles.rowBlock}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: isSelected }}
                onPress={() => setSelectedMetalCode(isSelected ? null : metal.code)}
                style={({ pressed }) => [
                  styles.metalRow,
                  isSelected && styles.metalRowSelected,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.metalBadge}>
                  <Text style={styles.metalBadgeText}>{metal.symbol}</Text>
                </View>
                <View style={styles.metalMain}>
                  <Text style={styles.metalTitle}>{metal.name}</Text>
                  <Text style={styles.metalMeta}>
                    {metal.unit} {metal.name} to Nepalese Rupee
                  </Text>
                </View>
                <View style={styles.metalSide}>
                  <Text style={styles.metalValue}>{metal.price}</Text>
                  <Ionicons
                    name={isSelected ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.mutedText}
                  />
                </View>
                <Pressable
                  accessibilityLabel={`Remove ${metal.name}`}
                  onPress={() => handleRemoveMetal(metal.code)}
                  style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
                >
                  <Ionicons name="remove" size={18} color={colors.mutedText} />
                </Pressable>
              </Pressable>

              {isSelected ? (
                <View style={styles.metalDetail}>
                  <View style={styles.detailRow}>
                    <Ionicons name="cash-outline" size={18} color={colors.primary} />
                    <Text style={styles.detailText}>
                      {metal.unit} {metal.name}: NPR {metal.price}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {hiddenMetals.length ? (
        <View style={styles.addSection}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: isAddMetalOpen }}
            onPress={() => setIsAddMetalOpen((isOpen) => !isOpen)}
            style={({ pressed }) => [styles.addToggle, pressed && styles.pressed]}
          >
            <View style={styles.addToggleText}>
              <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
              <Text style={styles.addTitle}>Add metal</Text>
            </View>
            <Ionicons
              name={isAddMetalOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.mutedText}
            />
          </Pressable>

          {isAddMetalOpen ? (
            <View style={styles.addGrid}>
              {hiddenMetals.map((metal) => (
                <Pressable
                  accessibilityRole="button"
                  key={metal.code}
                  onPress={() => handleAddMetal(metal.code)}
                  style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
                >
                  <Text style={styles.addText}>{metal.symbol}</Text>
                  <Text style={styles.addText}>{metal.name}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {vendors.length ? (
        <View style={styles.vendorSection}>
          <View style={styles.vendorHeader}>
            <Text style={styles.vendorTitle}>Vendors</Text>
            <Text style={styles.vendorHint}>Call vendors to buy and find the local price</Text>
          </View>

          <View style={styles.vendorList}>
            {vendors.map((vendor) => (
              <View key={vendor.id} style={styles.vendorRow}>
                <View style={styles.vendorMain}>
                  <Text style={styles.vendorName}>{vendor.name}</Text>
                  <Text style={styles.vendorPhone}>{vendor.phone}</Text>
                </View>
                <Pressable
                  accessibilityLabel={`Call ${vendor.name}`}
                  onPress={() => Linking.openURL(`tel:${vendor.phone}`)}
                  style={({ pressed }) => [styles.callButton, pressed && styles.pressed]}
                >
                  <Ionicons name="call" size={20} color={colors.primary} />
                </Pressable>
              </View>
            ))}
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
    borderColor: '#FDE68A',
    borderRadius: radius.md,
    backgroundColor: '#FFFCF2',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: '#D97706',
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
    borderColor: '#FDE68A',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  headerIconText: {
    color: avatarAccent,
    fontSize: 16,
    fontWeight: '900',
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
  rowBlock: {
    gap: spacing.sm,
  },
  metalRow: {
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
  metalRowSelected: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  pressed: {
    backgroundColor: '#F1F5F9',
  },
  metalBadge: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: radius.sm,
    backgroundColor: '#FEF3C7',
  },
  metalBadgeText: {
    color: avatarAccent,
    fontSize: 18,
    fontWeight: '900',
  },
  metalMain: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  metalTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  metalMeta: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  metalSide: {
    minWidth: 96,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  metalValue: {
    color: avatarAccent,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
  },
  iconButton: {
    width: 28,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  metalDetail: {
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: radius.md,
    backgroundColor: '#FFFBEB',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  addSection: {
    gap: spacing.sm,
  },
  addToggle: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  addToggleText: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  addGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  addButton: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  addText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  vendorSection: {
    gap: spacing.md,
  },
  vendorHeader: {
    gap: spacing.xs,
  },
  vendorTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  vendorHint: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  vendorList: {
    gap: spacing.xs,
  },
  vendorRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  vendorMain: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  vendorName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  vendorPhone: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  callButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: radius.md,
    backgroundColor: '#FFFBEB',
  },
});
