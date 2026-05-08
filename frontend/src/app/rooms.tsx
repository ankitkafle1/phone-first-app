import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';
import { getCurrentUser } from '../services/authService';

type LeaseListingType = 'Single room' | 'Apartment' | 'Shared space';

type LeaseListing = {
  id: string;
  title: string;
  listingType: LeaseListingType;
  price: string;
  location: string;
  phoneNumber: string;
  description: string;
  photos: string[];
  availableFrom: string;
};

const leaseListings: LeaseListing[] = [
  {
    id: 'kathmandu-single-room-balaju',
    title: 'Sunny single room near Balaju',
    listingType: 'Single room',
    price: 'रु 12,000 / month',
    location: 'Balaju, Kathmandu, NP',
    phoneNumber: '+9779800002101',
    description: 'Clean furnished room with shared kitchen, attached balcony, and easy bus access.',
    photos: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=720&h=480&fit=crop'],
    availableFrom: 'Available now',
  },
  {
    id: 'kathmandu-apartment-baneshwor',
    title: '2BHK apartment in Baneshwor',
    listingType: 'Apartment',
    price: 'रु 38,000 / month',
    location: 'New Baneshwor, Kathmandu, NP',
    phoneNumber: '+9779800002102',
    description: 'Two-bedroom apartment with parking, water tank, sunlight, and nearby grocery stores.',
    photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=720&h=480&fit=crop'],
    availableFrom: 'From Jestha 1',
  },
  {
    id: 'kathmandu-shared-space-patan',
    title: 'Shared space for student or worker',
    listingType: 'Shared space',
    price: 'रु 8,500 / month',
    location: 'Patan, Lalitpur, NP',
    phoneNumber: '+9779800002103',
    description: 'Shared room in a quiet home. Wi-Fi, drinking water, and simple cooking area included.',
    photos: ['https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=720&h=480&fit=crop'],
    availableFrom: 'Available this week',
  },
];

function callOwner(phoneNumber: string) {
  Linking.openURL(`tel:${phoneNumber}`);
}

export default function RoomsScreen() {
  const currentUser = getCurrentUser();
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | LeaseListingType>('All');

  const listingTypes = useMemo(
    () => ['All', ...Array.from(new Set(leaseListings.map((listing) => listing.listingType)))] as const,
    [],
  );
  const filteredListings = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return leaseListings.filter((listing) => {
      const searchableText = [
        listing.title,
        listing.listingType,
        listing.price,
        listing.location,
        listing.description,
        listing.availableFrom,
      ]
        .join(' ')
        .toLowerCase();

      return (
        (!normalizedSearch || searchableText.includes(normalizedSearch)) &&
        (selectedType === 'All' || listing.listingType === selectedType)
      );
    });
  }, [searchText, selectedType]);

  function handleAddListing() {
    if (!currentUser) {
      router.push('/register');
      return;
    }

    // Future: open add listing form/modal connected to Spring Boot.
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Link href="/people" asChild>
          <Pressable style={({ pressed }) => [styles.backButton, pressed && styles.lightPressed]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
        </Link>

        <View style={styles.titleGroup}>
          <Text style={styles.title}>Rooms</Text>
          <Text style={styles.subtitle}>Single rooms, apartments, and shared spaces for lease.</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handleAddListing}
        style={({ pressed }) => [styles.addPanel, pressed && styles.lightPressed]}
      >
        <View style={styles.addIcon}>
          <Ionicons name={currentUser ? 'add-circle-outline' : 'lock-closed-outline'} size={22} color={colors.primary} />
        </View>
        <View style={styles.addTextGroup}>
          <Text style={styles.addTitle}>Add new listing</Text>
          <Text style={styles.addDescription}>
            {currentUser
              ? 'Post a room, apartment, or shared space. The form will connect to Spring Boot later.'
              : 'Login before posting a room, apartment, or shared space.'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.mutedText} />
      </Pressable>

      <View style={styles.searchPanel}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.mutedText} />
          <TextInput
            autoCapitalize="none"
            onChangeText={setSearchText}
            placeholder="Search by type, location, price"
            placeholderTextColor={colors.mutedText}
            style={styles.searchInput}
            value={searchText}
          />
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Type</Text>
          <View style={styles.filterChips}>
            {listingTypes.map((listingType) => (
              <Pressable
                accessibilityRole="button"
                key={listingType}
                onPress={() => setSelectedType(listingType)}
                style={({ pressed }) => [
                  styles.filterChip,
                  selectedType === listingType && styles.filterChipSelected,
                  pressed && styles.lightPressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedType === listingType && styles.filterChipTextSelected,
                  ]}
                >
                  {listingType}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.listingList}>
        {filteredListings.map((listing) => (
          <View key={listing.id} style={styles.listingCard}>
            <Image
              accessibilityIgnoresInvertColors
              source={{ uri: listing.photos[0] }}
              style={styles.listingPhoto}
            />
            <View style={styles.listingBody}>
              <View style={styles.listingTopRow}>
                <View style={styles.listingTitleGroup}>
                  <Text style={styles.listingTitle}>{listing.title}</Text>
                  <Text style={styles.listingMeta}>
                    {listing.listingType} · {listing.location}
                  </Text>
                </View>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{listing.availableFrom}</Text>
                </View>
              </View>

              <Text style={styles.priceText}>{listing.price}</Text>
              <Text style={styles.descriptionText}>{listing.description}</Text>

              <Pressable
                accessibilityLabel={`Call owner for ${listing.title}`}
                onPress={() => callOwner(listing.phoneNumber)}
                style={({ pressed }) => [styles.callButton, pressed && styles.lightPressed]}
              >
                <Ionicons name="call" size={18} color={colors.primary} />
                <Text style={styles.callButtonText}>{listing.phoneNumber}</Text>
              </Pressable>
            </View>
          </View>
        ))}
        {!filteredListings.length ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matching rooms</Text>
            <Text style={styles.emptyText}>Try another type, location, price, or search text.</Text>
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
  addPanel: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  addIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
  },
  addTextGroup: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  addTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  addDescription: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
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
  listingList: {
    gap: spacing.md,
  },
  listingCard: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  listingPhoto: {
    width: '100%',
    aspectRatio: 1.7,
    backgroundColor: '#E5E7EB',
  },
  listingBody: {
    gap: spacing.sm,
    padding: spacing.md,
  },
  listingTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  listingTitleGroup: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  listingTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  listingMeta: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  typeBadge: {
    maxWidth: 118,
    minHeight: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
  },
  typeBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  priceText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
  },
  descriptionText: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
  callButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
  },
  callButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
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
