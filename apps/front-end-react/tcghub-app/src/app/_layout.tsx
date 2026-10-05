import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
	<GestureHandlerRootView style={{ flex: 1 }}>
    <PaperProvider theme={scheme === 'dark' ? MD3DarkTheme : MD3LightTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
	</GestureHandlerRootView>
  );
}
