import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';
import { getCurrentUser } from '../services/authService';

type ClassifiedCategory = 'Furniture' | 'Electronics' | 'Vehicle' | 'Home goods';
type ClassifiedCondition = 'New' | 'Like new' | 'Used';

type ClassifiedItem = {
  id: string;
  title: string;
  category: ClassifiedCategory;
  condition: ClassifiedCondition;
  price: string;
  location: string;
  phoneNumber: string;
  description: string;
  photos: string[];
  postedDate: string;
};

const classifiedItems: ClassifiedItem[] = [
  {
    id: 'wooden-dining-table-kathmandu',
    title: 'Wooden dining table with 4 chairs',
    category: 'Furniture',
    condition: 'Used',
    price: 'रु 18,000',
    location: 'Baneshwor, Kathmandu, NP',
    phoneNumber: '+9779800003101',
    description: 'Solid wooden dining set in good condition. Buyer can inspect before pickup.',
    photos: ['https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=720&h=480&fit=crop'],
    postedDate: 'Today',
  },
  {
    id: 'iphone-14-queens',
    title: 'iPhone 14, 128GB unlocked',
    category: 'Electronics',
    condition: 'Like new',
    price: '$520',
    location: 'Queens, New York, US',
    phoneNumber: '+17180003102',
    description: 'Unlocked phone with box and charger. No repair history, small case marks only.',
    photos: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=720&h=480&fit=crop'],
    postedDate: 'Yesterday',
  },
  {
    id: 'scooter-lalitpur',
    title: 'Honda Dio scooter',
    category: 'Vehicle',
    condition: 'Used',
    price: 'रु 145,000',
    location: 'Patan, Lalitpur, NP',
    phoneNumber: '+9779800003103',
    description: 'Regularly serviced scooter, blue book clear, suitable for daily commute.',
    photos: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=720&h=480&fit=crop'],
    postedDate: 'May 6',
  },
  {
    id: 'rice-cooker-irving',
    title: 'Electric rice cooker',
    category: 'Home goods',
    condition: 'New',
    price: '$35',
    location: 'Irving, Texas, US',
    phoneNumber: '+19720003104',
    description: 'Unopened rice cooker. Good for students or small family kitchen setup.',
    photos: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=720&h=480&fit=crop'],
    postedDate: 'May 5',
  },
];

function callSeller(phoneNumber: string) {
  Linking.openURL(`tel:${phoneNumber}`);
}

export default function BuySellScreen() {
  const currentUser = getCurrentUser();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ClassifiedCategory>('All');
  const [selectedCondition, setSelectedCondition] = useState<'All' | ClassifiedCondition>('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(classifiedItems.map((item) => item.category)))] as const,
    [],
  );
  const conditions = useMemo(
    () => ['All', ...Array.from(new Set(classifiedItems.map((item) => item.condition)))] as const,
    [],
  );
  const filteredItems = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return classifiedItems.filter((item) => {
      const searchableText = [
        item.title,
        item.category,
        item.condition,
        item.price,
        item.location,
        item.description,
        item.postedDate,
      ]
        .join(' ')
        .toLowerCase();

      return (
        (!normalizedSearch || searchableText.includes(normalizedSearch)) &&
        (selectedCategory === 'All' || item.category === selectedCategory) &&
        (selectedCondition === 'All' || item.condition === selectedCondition)
      );
    });
  }, [searchText, selectedCategory, selectedCondition]);

  function handleAddItem() {
    if (!currentUser) {
      router.push('/register');
      return;
    }

    // Future: open add classified item form/modal connected to Spring Boot.
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
          <Text style={styles.title}>Buy & Sell</Text>
          <Text style={styles.subtitle}>Local classifieds for items near your selected city.</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handleAddItem}
        style={({ pressed }) => [styles.addPanel, pressed && styles.lightPressed]}
      >
        <View style={styles.addIcon}>
          <Ionicons name={currentUser ? 'add-circle-outline' : 'lock-closed-outline'} size={22} color={colors.primary} />
        </View>
        <View style={styles.addTextGroup}>
          <Text style={styles.addTitle}>Add item</Text>
          <Text style={styles.addDescription}>
            {currentUser
              ? 'Post an item with photos, price, category, location, and contact info.'
              : 'Login before posting an item for sale.'}
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
            placeholder="Search item, category, location"
            placeholderTextColor={colors.mutedText}
            style={styles.searchInput}
            value={searchText}
          />
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Category</Text>
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
          <Text style={styles.filterLabel}>Condition</Text>
          <View style={styles.filterChips}>
            {conditions.map((condition) => (
              <Pressable
                accessibilityRole="button"
                key={condition}
                onPress={() => setSelectedCondition(condition)}
                style={({ pressed }) => [
                  styles.filterChip,
                  selectedCondition === condition && styles.filterChipSelected,
                  pressed && styles.lightPressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCondition === condition && styles.filterChipTextSelected,
                  ]}
                >
                  {condition}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.itemList}>
        {filteredItems.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image
              accessibilityIgnoresInvertColors
              source={{ uri: item.photos[0] }}
              style={styles.itemPhoto}
            />
            <View style={styles.itemBody}>
              <View style={styles.itemTopRow}>
                <View style={styles.itemTitleGroup}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemMeta}>
                    {item.category} · {item.condition} · {item.location}
                  </Text>
                </View>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateBadgeText}>{item.postedDate}</Text>
                </View>
              </View>

              <Text style={styles.priceText}>{item.price}</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>

              <Pressable
                accessibilityLabel={`Call seller for ${item.title}`}
                onPress={() => callSeller(item.phoneNumber)}
                style={({ pressed }) => [styles.callButton, pressed && styles.lightPressed]}
              >
                <Ionicons name="call" size={18} color={colors.primary} />
                <Text style={styles.callButtonText}>{item.phoneNumber}</Text>
              </Pressable>
            </View>
          </View>
        ))}
        {!filteredItems.length ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matching items</Text>
            <Text style={styles.emptyText}>Try another category, condition, location, or search text.</Text>
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
  itemList: {
    gap: spacing.md,
  },
  itemCard: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  itemPhoto: {
    width: '100%',
    aspectRatio: 1.7,
    backgroundColor: '#E5E7EB',
  },
  itemBody: {
    gap: spacing.sm,
    padding: spacing.md,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  itemTitleGroup: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  itemMeta: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  dateBadge: {
    maxWidth: 82,
    minHeight: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
  },
  dateBadgeText: {
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
