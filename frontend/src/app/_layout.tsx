import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="people" options={{ animation: 'slide_from_left' }} />
      </Stack>
      <StatusBar backgroundColor={colors.background} style="dark" translucent={false} />
    </SafeAreaProvider>
  );
}
