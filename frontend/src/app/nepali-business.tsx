import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';

type SuchanaPatiCard = {
  id: string;
  name: string;
  category: string;
  info: string;
  phoneNumber: string;
  photos: string[];
  city: string;
  countryCode: string;
  rating?: number;
  reviewCount?: number;
};

const suchanaPatiCards: SuchanaPatiCard[] = [
  {
    id: 'himalayan-momo-house',
    name: 'Himalayan Momo House',
    category: 'Restaurant',
    info: 'Fresh momo, chowmein, and Nepali snacks near the local market.',
    phoneNumber: '+9779800001001',
    photos: ['https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=640&h=420&fit=crop'],
    city: 'Kathmandu',
    countryCode: 'NP',
    rating: 4.6,
    reviewCount: 28,
  },
  {
    id: 'namaste-remit',
    name: 'Namaste Remit & Travel',
    category: 'Remittance',
    info: 'Money transfer, ticket booking, and document support for local families.',
    phoneNumber: '+9779800001002',
    photos: ['https://images.unsplash.com/photo-1521791055366-0d553872125f?w=640&h=420&fit=crop'],
    city: 'Kathmandu',
    countryCode: 'NP',
    rating: 4.4,
    reviewCount: 16,
  },
  {
    id: 'new-road-gold-care',
    name: 'New Road Gold Care',
    category: 'Jewellery',
    info: 'Gold, silver, repair, polish, and custom jewellery orders.',
    phoneNumber: '+9779800001003',
    photos: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=640&h=420&fit=crop'],
    city: 'Kathmandu',
    countryCode: 'NP',
    rating: 4.8,
    reviewCount: 41,
  },
];

function callBusiness(phoneNumber: string) {
  Linking.openURL(`tel:${phoneNumber}`);
}

export default function SuchanaPatiScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minimumRating, setMinimumRating] = useState(0);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(suchanaPatiCards.map((card) => card.category)))],
    [],
  );
  const ratingFilters = useMemo(
    () => [0, ...Array.from(new Set(suchanaPatiCards.map((card) => Math.floor(card.rating ?? 0))))]
      .filter((rating) => rating === 0 || rating > 0)
      .sort((firstRating, secondRating) => firstRating - secondRating),
    [],
  );
  const filteredCards = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return suchanaPatiCards.filter((card) => {
      const location = `${card.city}, ${card.countryCode}`;
      const searchableText = [card.name, card.category, card.info, location]
        .join(' ')
        .toLowerCase();

      return (
        (!normalizedSearch || searchableText.includes(normalizedSearch)) &&
        (selectedCategory === 'All' || card.category === selectedCategory) &&
        (card.rating ?? 0) >= minimumRating
      );
    });
  }, [minimumRating, searchText, selectedCategory]);

  return (
    <Screen>
      <View style={styles.header}>
        <Link href="/people" asChild>
          <Pressable style={({ pressed }) => [styles.backButton, pressed && styles.lightPressed]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
        </Link>

        <View style={styles.titleGroup}>
          <Text style={styles.title}>Nepali Business</Text>
          <Text style={styles.subtitle}>Local Nepali businesses, services, ads, and reviews.</Text>
        </View>
      </View>

      <View style={styles.searchPanel}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.mutedText} />
          <TextInput
            autoCapitalize="none"
            onChangeText={setSearchText}
            placeholder="Search by name, type, rating, info"
            placeholderTextColor={colors.mutedText}
            style={styles.searchInput}
            value={searchText}
          />
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Type</Text>
          <View style={styles.filterChips}>
            {categories.map((category) => (
              <Pressable
                accessibilityRole="button"
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={({ pressed }) => [
                  styles.filterChip,
                  selectedCategory === category && styles.filterChipSelected,
                  pressed && styles.lightPressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCategory === category && styles.filterChipTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Rating</Text>
          <View style={styles.filterChips}>
            {ratingFilters.map((rating) => (
              <Pressable
                accessibilityRole="button"
                key={rating}
                onPress={() => setMinimumRating(rating)}
                style={({ pressed }) => [
                  styles.filterChip,
                  minimumRating === rating && styles.filterChipSelected,
                  pressed && styles.lightPressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    minimumRating === rating && styles.filterChipTextSelected,
                  ]}
                >
                  {rating === 0 ? 'All' : `${rating}+`}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.cardList}>
        {filteredCards.map((card) => (
          <View key={card.id} style={styles.businessCard}>
            <Image
              accessibilityIgnoresInvertColors
              source={{ uri: card.photos[0] }}
              style={styles.businessPhoto}
            />
            <View style={styles.businessBody}>
              <View style={styles.businessTopRow}>
                <View style={styles.businessTitleGroup}>
                  <Text style={styles.businessName}>{card.name}</Text>
                  <Text style={styles.businessMeta}>
                    {card.category} · {card.city}, {card.countryCode}
                  </Text>
                </View>
                {card.rating ? (
                  <View style={styles.ratingPill}>
                    <Ionicons name="star" size={13} color="#CA8A04" />
                    <Text style={styles.ratingText}>{card.rating.toFixed(1)}</Text>
                  </View>
                ) : null}
              </View>

              <Text style={styles.businessInfo}>{card.info}</Text>

              <View style={styles.actionRow}>
                <Pressable
                  accessibilityLabel={`Call ${card.name}`}
                  onPress={() => callBusiness(card.phoneNumber)}
                  style={({ pressed }) => [styles.callButton, pressed && styles.lightPressed]}
                >
                  <Ionicons name="call" size={18} color={colors.primary} />
                  <Text style={styles.callButtonText}>{card.phoneNumber}</Text>
                </Pressable>
                <View style={styles.reviewPlaceholder}>
                  <Ionicons name="chatbubble-outline" size={16} color={colors.mutedText} />
                  <Text style={styles.reviewText}>{card.reviewCount ?? 0} reviews</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
        {!filteredCards.length ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matching ads</Text>
            <Text style={styles.emptyText}>Try another name, type, rating, or location.</Text>
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
  cardList: {
    gap: spacing.md,
  },
  businessCard: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  businessPhoto: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#EFF6FF',
  },
  businessBody: {
    gap: spacing.md,
    padding: spacing.md,
  },
  businessTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  businessTitleGroup: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  businessName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  businessMeta: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  ratingPill: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: '#FEF3C7',
  },
  ratingText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  businessInfo: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  actionRow: {
    gap: spacing.sm,
  },
  callButton: {
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
  callButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  reviewPlaceholder: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  reviewText: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: '800',
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
