import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors, radius, spacing } from '../../../constants/theme';
import {
  goldVendorsByLocation,
  preciousMetalRates,
  type PreciousMetalRate,
  type HomeLocation,
} from '../homeData';

const avatarAccent = '#003577';

type GoldPriceCardProps = {
  homeLocation: HomeLocation;
};

export function GoldPriceCard({ homeLocation }: GoldPriceCardProps) {
  const [areVendorsVisible, setAreVendorsVisible] = useState(false);
  const [expandedMetalCode, setExpandedMetalCode] = useState<string | null>(null);
  const visiblePreciousMetalRates = preciousMetalRates.filter((metal) =>
    ['GOLD', 'SILVER'].includes(metal.code),
  );
  const goldVendors =
    goldVendorsByLocation[`${homeLocation.city}-${homeLocation.countryCode}`] ?? [];

  function handleCallVendor(phone: string) {
    Linking.openURL(`tel:${phone}`);
  }

  return (
    <View style={styles.card}>
      <View style={styles.accent} />

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>Au</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>सुन चाँदी</Text>
          <Text style={styles.headerMeta}>{visiblePreciousMetalRates.length} metals</Text>
        </View>
      </View>

      <View style={styles.rows}>
        {visiblePreciousMetalRates.map((metal) => {
          const isExpanded = expandedMetalCode === metal.code;

          return (
            <View key={metal.code} style={styles.rowBlock}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: isExpanded }}
                onPress={() => setExpandedMetalCode((code) => (code === metal.code ? null : metal.code))}
                style={({ pressed }) => [
                  styles.metalRow,
                  isExpanded && styles.metalRowSelected,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.metalBadge}>
                  <Text style={styles.metalBadgeText}>{metal.symbol}</Text>
                </View>
                <View style={styles.metalMain}>
                  <Text style={styles.metalName}>{metal.name}</Text>
                  <Text style={styles.metalMeta}>{metal.unit} to Nepalese Rupee</Text>
                </View>
                <View style={styles.metalSide}>
                  <Text style={styles.metalPrice}>{metal.price}</Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.mutedText}
                  />
                </View>
              </Pressable>

              {isExpanded ? (
                <View style={styles.chartSection}>
                  <MetalTrend metal={metal} />
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {goldVendors.length ? (
        <View style={styles.vendorSection}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: areVendorsVisible }}
            onPress={() => setAreVendorsVisible((isVisible) => !isVisible)}
            style={({ pressed }) => [styles.vendorToggle, pressed && styles.pressed]}
          >
            <View style={styles.vendorHeader}>
              <Text style={styles.vendorTitle}>Vendors</Text>
              <Text style={styles.vendorHint}>Call vendors to buy and find the local price</Text>
            </View>
            <View style={styles.vendorToggleSide}>
              <Text style={styles.vendorCount}>{goldVendors.length}</Text>
              <Ionicons
                name={areVendorsVisible ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#0F766E"
              />
            </View>
          </Pressable>

          {areVendorsVisible ? (
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={goldVendors.length > 3}
              style={styles.vendorScroll}
              contentContainerStyle={styles.vendorList}
            >
              {goldVendors.map((vendor) => (
                <View key={vendor.id} style={styles.vendorRow}>
                  <View style={styles.vendorMain}>
                    <Text style={styles.vendorName}>{vendor.name}</Text>
                    <Text style={styles.vendorPhone}>{vendor.phone}</Text>
                  </View>
                  <Pressable
                    accessibilityLabel={`Call ${vendor.name}`}
                    onPress={() => handleCallVendor(vendor.phone)}
                    style={({ pressed }) => [styles.callButton, pressed && styles.pressed]}
                  >
                    <Ionicons name="call" size={20} color={avatarAccent} />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function MetalTrend({ metal }: { metal: PreciousMetalRate }) {
  const values = metal.history.map((point) => point.value);
  const minPrice = Math.min(...values);
  const maxPrice = Math.max(...values);
  const midPrice = Math.round((minPrice + maxPrice) / 2);
  const firstPrice = values[0] ?? 0;
  const latestPrice = values[values.length - 1] ?? 0;
  const highPrice = maxPrice;
  const lowPrice = minPrice;
  const change = latestPrice - firstPrice;
  const changePercent = firstPrice ? (change / firstPrice) * 100 : 0;
  const chartPoints = metal.history.map((point, index) => {
    const ratio = maxPrice === minPrice ? 0.5 : (point.value - minPrice) / (maxPrice - minPrice);
    const x = metal.history.length === 1 ? 50 : 4 + (index / (metal.history.length - 1)) * 92;
    const y = 60 - ratio * 48;

    return { ...point, x, y };
  });
  const pathData = chartPoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <View style={styles.trendCard}>
      <View style={styles.trendHeader}>
        <View>
          <Text style={styles.trendTitle}>7 day price trend</Text>
          <Text style={styles.trendSubtitle}>Recent local market movement</Text>
        </View>
        <Text style={[styles.trendChange, change >= 0 ? styles.trendUp : styles.trendDown]}>
          {change >= 0 ? '+' : ''}
          {formatNumber(change)}
        </Text>
      </View>

      <View style={styles.lineChart}>
        <View style={styles.chartBody}>
          <View style={styles.yAxis}>
            <Text style={styles.axisLabel}>{formatCompactPrice(maxPrice)}</Text>
            <Text style={styles.axisLabel}>{formatCompactPrice(midPrice)}</Text>
            <Text style={styles.axisLabel}>{formatCompactPrice(minPrice)}</Text>
          </View>
          <View style={styles.plotColumn}>
            <Svg preserveAspectRatio="none" style={styles.chartSvg} viewBox="0 0 100 72">
              <Path
                d="M 0 12 L 0 62 L 100 62"
                fill="none"
                stroke="#CBD5E1"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.4}
              />
              <Path
                d="M 0 37 L 100 37"
                fill="none"
                opacity={0.6}
                stroke="#E2E8F0"
                strokeLinecap="round"
                strokeWidth={1}
              />
              <Path
                d={pathData}
                fill="none"
                stroke="#0F766E"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.8}
              />
              {chartPoints.map((point) => (
                <Circle
                  cx={point.x}
                  cy={point.y}
                  fill="#0F766E"
                  key={`${metal.code}-circle-${point.label}`}
                  r={2.5}
                  stroke="#FFFFFF"
                  strokeWidth={1.3}
                />
              ))}
            </Svg>
            <View style={styles.xAxisLabels}>
              {chartPoints.map((point) => (
                <Text key={`${metal.code}-label-${point.label}`} style={styles.lineDay}>
                  {point.label}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.trendStats}>
        <View style={styles.trendStat}>
          <Text style={styles.trendStatLabel}>Latest</Text>
          <Text style={styles.trendStatValue}>{formatNumber(latestPrice)}</Text>
        </View>
        <View style={styles.trendStat}>
          <Text style={styles.trendStatLabel}>High</Text>
          <Text style={styles.trendStatValue}>{formatNumber(highPrice)}</Text>
        </View>
        <View style={styles.trendStat}>
          <Text style={styles.trendStatLabel}>Low</Text>
          <Text style={styles.trendStatValue}>{formatNumber(lowPrice)}</Text>
        </View>
        <View style={styles.trendStat}>
          <Text style={styles.trendStatLabel}>Change</Text>
          <Text style={[styles.trendStatValue, change >= 0 ? styles.trendUp : styles.trendDown]}>
            {changePercent >= 0 ? '+' : ''}
            {changePercent.toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

function formatCompactPrice(value: number) {
  if (value >= 100000) {
    return `${Math.round(value / 1000)}k`;
  }

  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    overflow: 'hidden',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#5EEAD4',
    borderRadius: radius.md,
    backgroundColor: '#F0FDFA',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: '#0F766E',
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
    borderColor: '#99F6E4',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  headerIconText: {
    color: avatarAccent,
    fontSize: 18,
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
    borderColor: '#99F6E4',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  metalRowSelected: {
    borderColor: '#0F766E',
    backgroundColor: '#CCFBF1',
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
    borderColor: '#99F6E4',
    borderRadius: radius.sm,
    backgroundColor: '#CCFBF1',
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
  metalName: {
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
    minWidth: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  metalPrice: {
    color: avatarAccent,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
  },
  chartSection: {
    padding: 0,
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  trendCard: {
    gap: spacing.md,
    padding: spacing.md,
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  trendTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  trendSubtitle: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  trendChange: {
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 18,
  },
  trendUp: {
    color: '#15803D',
  },
  trendDown: {
    color: '#B91C1C',
  },
  lineChart: {
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: radius.md,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  chartBody: {
    minHeight: 116,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.xs,
  },
  yAxis: {
    width: 44,
    justifyContent: 'space-between',
    paddingTop: 2,
    paddingBottom: 25,
    paddingRight: spacing.xs,
  },
  axisLabel: {
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'right',
  },
  plotColumn: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  },
  chartSvg: {
    width: '100%',
    height: 92,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  lineDay: {
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 14,
    paddingBottom: 2,
  },
  trendStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  trendStat: {
    minWidth: '47%',
    flex: 1,
    gap: 2,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: radius.md,
    backgroundColor: '#F0FDFA',
  },
  trendStatLabel: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 15,
  },
  trendStatValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
  },
  vendorSection: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  vendorToggle: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  vendorHeader: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  vendorToggleSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  vendorCount: {
    color: '#0F766E',
    fontSize: 14,
    fontWeight: '900',
  },
  vendorTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  vendorHint: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  vendorList: {
    gap: spacing.xs,
  },
  vendorScroll: {
    maxHeight: 240,
  },
  vendorRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: '#99F6E4',
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
    borderColor: '#99F6E4',
    borderRadius: radius.md,
    backgroundColor: '#CCFBF1',
  },
});
