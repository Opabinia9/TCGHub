import { Drawer } from 'expo-router/drawer';
import { Drawer as PaperDrawer, Avatar, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RelativePathString, useRouter, useSegments, Href } from 'expo-router';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';


function CustomDrawerContent(props: DrawerContentComponentProps) {
  const theme = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments[0] || '(drawer)';
  const navigateTo = (routeName: Href) => {
    router.navigate(routeName);
  };

  return (
	<View>
    <PaperDrawer.Section title="Navigation">
      <PaperDrawer.Item
        label="Home"
		icon="home"
		active={currentRoute === 'home'}
        onPress={() => navigateTo('/home')}
      />
      <PaperDrawer.Item
        label="Cards"
		icon="cog"
		active={currentRoute === 'cards'}
        onPress={() => navigateTo('/cards')}
      />
      <PaperDrawer.Item
        label="Decks"
		icon="profile"
		active={currentRoute === 'decks'}
        onPress={() => navigateTo('/decks')}
      />
	  <PaperDrawer.Item
        label="Players"
		icon="home"
		active={currentRoute === 'players'}
        onPress={() => navigateTo('/players')}
      />
      <PaperDrawer.Item
        label="Chat"
		icon="cog"
		active={currentRoute === 'cards'}
        onPress={() => navigateTo('/cards')}
      />
	  <PaperDrawer.Item
        label="Collection"
		icon="profile"
		active={currentRoute === 'collection'}
        onPress={() => navigateTo('/collection')}
      />
      <PaperDrawer.Item
        label="Trades"
		icon="home"
		active={currentRoute === 'trades'}
        onPress={() => navigateTo('/trades')}
      />
	  <PaperDrawer.Section title="Account">
      <PaperDrawer.Item
        label="Profile"
		icon="cog"
		active={currentRoute === 'decks'}
        onPress={() => navigateTo('/decks')}
      />
	  </PaperDrawer.Section>
    </PaperDrawer.Section>
	</View>
  );
}

export default function RootLayout () {
  return (
	<GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <Drawer
          drawerContent={(props) => <CustomDrawerContent />}
          screenOptions={{
            headerShown: true, // Shows standard toggle header
          }}
        >
          {/* Target screens mapped to your file structure */}
          <Drawer.Screen
            name="home"
            options={{ title: 'Home Dashboard' }}
          />
          <Drawer.Screen
            name="profile"
            options={{ title: 'App Settings' }}
          />
        </Drawer>
      </PaperProvider>
    </GestureHandlerRootView>
  )
}
