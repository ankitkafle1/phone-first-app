import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';

const people = ['Ankit1', 'Ankit2', 'Ankit3', 'Ankit4', 'Ankit5'];

export default function PeopleScreen() {
  return (
    <Screen>
      <View style={styles.topBar}>
        <Link href="/home" asChild>
          <Pressable style={({ pressed }) => [styles.backButton, pressed && styles.lightPressed]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
        </Link>

        <View style={styles.titleGroup}>
          <Text style={styles.title}>Namaste</Text>
          <Text style={styles.subtitle}>People</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCellRight}>Status</Text>
        </View>

        {people.map((name) => (
          <View key={name} style={styles.tableRow}>
            <View style={styles.nameCell}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{name.charAt(0)}</Text>
              </View>
              <Text style={styles.nameText}>{name}</Text>
            </View>
            <Text style={styles.statusText}>Active</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: '#003577',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  table: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  tableHeader: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: '#EFF6FF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerCell: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  headerCellRight: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
  },
  tableRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  nameCell: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#003577',
    borderRadius: 17,
    backgroundColor: '#EEF6FF',
  },
  avatarText: {
    color: '#003577',
    fontSize: 15,
    fontWeight: '900',
  },
  nameText: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  statusText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '800',
  },
  lightPressed: {
    opacity: 0.72,
  },
});
