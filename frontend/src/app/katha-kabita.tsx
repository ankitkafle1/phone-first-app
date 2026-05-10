import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';
import { getCurrentUser } from '../services/authService';

type KathaKabitaLanguage = 'nepali' | 'english';

type KathaKabitaContentType = 'katha' | 'kabita' | 'gazal';

type KathaKabitaComment = {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
};

type KathaKabitaPost = {
  id: string;
  title: string;
  contentType: KathaKabitaContentType;
  language: KathaKabitaLanguage;
  body: string;
  writer: {
    id: string;
    name: string;
  };
  publishedDate: string;
  publishedOrder: number;
  likeCount: number;
  comments: KathaKabitaComment[];
};

type KathaKabitaSort = 'recent' | 'popular';

const contentTypeLabels: Record<KathaKabitaContentType, string> = {
  katha: 'Katha',
  kabita: 'Kabita',
  gazal: 'Gazal',
};

const kathaKabitaPosts: KathaKabitaPost[] = [
  {
    id: 'sajha-ko-ghazal',
    title: 'साँझको गजल',
    contentType: 'gazal',
    language: 'nepali',
    body: 'साँझ झर्दा सम्झनाले ढोका ढकढक्यायो,\nमनको आँगनमा तिम्रो नामले दीप बाल्यो।\nशब्दहरू चुप थिए, तर आँखाले कथा भन्यो,\nटाढा भएर पनि तिमी नजिकै छौ जस्तो लाग्यो।',
    writer: { id: 'writer-1', name: 'अनुप शर्मा' },
    publishedDate: '२०८३ वैशाख २३',
    publishedOrder: 3,
    likeCount: 128,
    comments: [
      {
        id: 'comment-1',
        authorName: 'Maya',
        text: 'धेरै मिठो गजल।',
        createdAt: 'आज',
      },
    ],
  },
  {
    id: 'home-road',
    title: 'Road Back Home',
    contentType: 'kabita',
    language: 'english',
    body: 'I carry a small map of home in my chest,\nA street of rain, a window of light,\nAnd every city I cross\nLearns your name before mine.',
    writer: { id: 'writer-2', name: 'Suman Rai' },
    publishedDate: 'May 6, 2026',
    publishedOrder: 2,
    likeCount: 76,
    comments: [
      {
        id: 'comment-2',
        authorName: 'Rita',
        text: 'Simple and beautiful.',
        createdAt: 'Yesterday',
      },
      {
        id: 'comment-3',
        authorName: 'Amit',
        text: 'Loved the last line.',
        createdAt: 'Yesterday',
      },
    ],
  },
  {
    id: 'phool-ra-bato',
    title: 'फूल र बाटो',
    contentType: 'kabita',
    language: 'nepali',
    body: 'बाटोले भन्यो, हिँडिराख,\nफूलले भन्यो, मुस्कुराइराख।\nजीवनले बिस्तारै सिकायो,\nदुःखमा पनि उज्यालो खोजिराख।',
    writer: { id: 'writer-3', name: 'रीना श्रेष्ठ' },
    publishedDate: '२०८३ वैशाख २०',
    publishedOrder: 1,
    likeCount: 94,
    comments: [],
  },
  {
    id: 'chiya-pasal-ko-katha',
    title: 'चिया पसलको कथा',
    contentType: 'katha',
    language: 'nepali',
    body: 'पुरानो चिया पसलमा हरेक बिहान एउटै गीत बज्थ्यो।\nत्यही गीतसँगै मानिसहरू आफ्ना साना सपना र ठूला चिन्ता लिएर आउँथे।\nएक दिन पसलेले सबैको कुरा सुनेर भन्यो, घर कहिलेकाहीँ ठाउँ होइन, सुन्ने मान्छे हो।',
    writer: { id: 'writer-4', name: 'मिलन गुरुङ' },
    publishedDate: '२०८३ वैशाख २४',
    publishedOrder: 4,
    likeCount: 63,
    comments: [],
  },
];

export default function KathaKabitaScreen() {
  const currentUser = getCurrentUser();
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | KathaKabitaContentType>('all');
  const [selectedWriter, setSelectedWriter] = useState('All');
  const [selectedSort, setSelectedSort] = useState<KathaKabitaSort>('recent');
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);

  const writerFilters = useMemo(
    () => ['All', ...Array.from(new Set(kathaKabitaPosts.map((post) => post.writer.name)))],
    [],
  );
  const typeFilters = useMemo(
    () => ['all', ...Array.from(new Set(kathaKabitaPosts.map((post) => post.contentType)))] as const,
    [],
  );
  const sortFilters: { label: string; value: KathaKabitaSort }[] = [
    { label: 'Recent', value: 'recent' },
    { label: 'Most liked', value: 'popular' },
  ];
  const filteredPosts = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return kathaKabitaPosts
      .filter((post) => {
        const searchableText = [
          post.title,
          post.body,
          post.writer.name,
          post.publishedDate,
          post.contentType,
          post.language,
        ]
          .join(' ')
          .toLowerCase();

        return (
          (!normalizedSearch || searchableText.includes(normalizedSearch)) &&
          (selectedType === 'all' || post.contentType === selectedType) &&
          (selectedWriter === 'All' || post.writer.name === selectedWriter)
        );
      })
      .sort((firstPost, secondPost) =>
        selectedSort === 'popular'
          ? secondPost.likeCount - firstPost.likeCount
          : secondPost.publishedOrder - firstPost.publishedOrder,
      );
  }, [searchText, selectedSort, selectedType, selectedWriter]);

  function handleAddPost() {
    if (!currentUser) {
      router.push('/register');
      return;
    }

    // Future: open add katha/kabita form/modal connected to Spring Boot.
  }

  function handleToggleLike(postId: string) {
    setLikedPostIds((ids) =>
      ids.includes(postId) ? ids.filter((id) => id !== postId) : [...ids, postId],
    );
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
          <Text style={styles.title}>कथा / कविता</Text>
          <Text style={styles.subtitle}>Katha, kabita, and gazal from the community.</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handleAddPost}
        style={({ pressed }) => [styles.addPanel, pressed && styles.lightPressed]}
      >
        <View style={styles.addIcon}>
          <Ionicons name={currentUser ? 'create-outline' : 'lock-closed-outline'} size={22} color={colors.primary} />
        </View>
        <View style={styles.addTextGroup}>
          <Text style={styles.addTitle}>{currentUser ? 'आफ्नो सिर्जना थप्नुहोस्' : 'आफ्नो सिर्जना थप्नुहोस्'}</Text>
          <Text style={styles.addDescription}>
            {currentUser
              ? 'कथा, कविता वा गजल प्रकाशित गर्ने फारम पछि Spring Boot सँग जोडिनेछ।'
              : 'कथा, कविता वा गजल प्रकाशित गर्न पहिले लगइन गर्नुहोस्।'}
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
            placeholder="Search katha, kabita, writer, type"
            placeholderTextColor={colors.mutedText}
            style={styles.searchInput}
            value={searchText}
          />
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Type</Text>
          <View style={styles.filterChips}>
            {typeFilters.map((contentType) => (
              <Pressable
                accessibilityRole="button"
                key={contentType}
                onPress={() => setSelectedType(contentType)}
                style={({ pressed }) => [
                  styles.filterChip,
                  selectedType === contentType && styles.filterChipSelected,
                  pressed && styles.lightPressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedType === contentType && styles.filterChipTextSelected,
                  ]}
                >
                  {contentType === 'all' ? 'All' : contentTypeLabels[contentType]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Writer</Text>
          <View style={styles.filterChips}>
            {writerFilters.map((writer) => (
              <Pressable
                accessibilityRole="button"
                key={writer}
                onPress={() => setSelectedWriter(writer)}
                style={({ pressed }) => [
                  styles.filterChip,
                  selectedWriter === writer && styles.filterChipSelected,
                  pressed && styles.lightPressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedWriter === writer && styles.filterChipTextSelected,
                  ]}
                >
                  {writer}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Sort</Text>
          <View style={styles.filterChips}>
            {sortFilters.map((sortOption) => (
              <Pressable
                accessibilityRole="button"
                key={sortOption.value}
                onPress={() => setSelectedSort(sortOption.value)}
                style={({ pressed }) => [
                  styles.filterChip,
                  selectedSort === sortOption.value && styles.filterChipSelected,
                  pressed && styles.lightPressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedSort === sortOption.value && styles.filterChipTextSelected,
                  ]}
                >
                  {sortOption.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.postList}>
        {filteredPosts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postTitleGroup}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postMeta}>
                  {post.writer.name} · {post.publishedDate} · {contentTypeLabels[post.contentType]} · {post.language}
                </Text>
              </View>
              <View style={styles.languageBadge}>
                <Text style={styles.languageBadgeText}>
                  {post.language === 'nepali' ? 'ने' : 'EN'}
                </Text>
              </View>
            </View>

            <Text style={styles.postBody}>{post.body}</Text>

            <View style={styles.engagementRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: likedPostIds.includes(post.id) }}
                onPress={() => handleToggleLike(post.id)}
                style={({ pressed }) => [
                  styles.engagementPill,
                  likedPostIds.includes(post.id) && styles.engagementPillSelected,
                  pressed && styles.lightPressed,
                ]}
              >
                <Ionicons
                  name={likedPostIds.includes(post.id) ? 'heart' : 'heart-outline'}
                  size={17}
                  color={colors.primary}
                />
                <Text style={styles.engagementText}>
                  {post.likeCount + (likedPostIds.includes(post.id) ? 1 : 0)}
                </Text>
              </Pressable>
              <View style={styles.engagementPill}>
                <Ionicons name="chatbubble-outline" size={17} color={colors.primary} />
                <Text style={styles.engagementText}>{post.comments.length}</Text>
              </View>
            </View>

          </View>
        ))}
        {!filteredPosts.length ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matching posts</Text>
            <Text style={styles.emptyText}>Try another writer, date, type, or search text.</Text>
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
  postList: {
    gap: spacing.md,
  },
  postCard: {
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  postTitleGroup: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  postTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  postMeta: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  languageBadge: {
    minWidth: 34,
    minHeight: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
  },
  languageBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  postBody: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 26,
  },
  engagementRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  engagementPill: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
  },
  engagementPillSelected: {
    borderColor: '#93C5FD',
    backgroundColor: '#DBEAFE',
  },
  engagementText: {
    color: colors.primary,
    fontSize: 13,
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
