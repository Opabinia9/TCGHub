import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts, BarlowCondensed_700Bold } from '@expo-google-fonts/barlow-condensed';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ BarlowCondensed_700Bold });
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? MD3DarkTheme : MD3LightTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <StatusBar style="dark" />
        <SafeAreaView
          edges={['top']}
          style={{ flex: 1, backgroundColor: '#E2D7BD' }}
        >
          <Stack
            initialRouteName="(auth)"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </SafeAreaView>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}