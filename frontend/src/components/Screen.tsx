import { PropsWithChildren } from 'react';
import { Platform, ScrollView, ScrollViewProps, StyleSheet, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../constants/theme';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  contentProps?: ViewProps;
  scrollProps?: ScrollViewProps;
}>;

export function Screen({ children, contentProps, scroll = true, scrollProps }: ScreenProps) {
  const content = (
    <View {...contentProps} style={[styles.content, contentProps?.style]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={styles.safeArea}>
      {scroll ? (
        <ScrollView
          {...scrollProps}
          contentContainerStyle={[styles.scrollContent, scrollProps?.contentContainerStyle]}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : undefined,
    alignSelf: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
});
