
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
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
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: '#E2D7BD',
              tabBarInactiveTintColor: '#A79E8B',
              tabBarStyle: {
                backgroundColor: '#171717',
                borderTopColor: '#171717',
                height: 65,
                paddingTop: 7,
                paddingBottom: 7,
              },
              tabBarLabelStyle: {
                fontSize: 11,
              },
            }}
          >
            <Tabs.Screen
              name="(drawer)"
              options={{
                href: null,
              }}
            />

            <Tabs.Screen
              name="index"
              options={{
                title: 'Home',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name="home-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />

            <Tabs.Screen
              name="cards"
              options={{
                title: 'Cards',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name="albums-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />

            <Tabs.Screen
              name="decks"
              options={{
                title: 'Decks',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name="library-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />

            <Tabs.Screen
              name="players"
              options={{
                title: 'Players',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name="people-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />

            <Tabs.Screen
              name="trade"
              options={{
                title: 'Trade',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name="chatbubbles-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
          </Tabs>
        </SafeAreaView>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
