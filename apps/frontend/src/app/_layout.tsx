import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts, BarlowCondensed_700Bold } from '@expo-google-fonts/barlow-condensed';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ BarlowCondensed_700Bold });
  const isDark = useColorScheme() === 'dark';
  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  // Our black as the main colour, so text cursors and focus outlines aren't purple.
  const theme = {
    ...baseTheme,
    colors: { ...baseTheme.colors, primary: '#171717' },
  };
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={theme}>
          <StatusBar style="dark" />
          <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#E2D7BD' }}>
            <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
              </Stack>
            </KeyboardProvider>
          </SafeAreaView>
        </PaperProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
