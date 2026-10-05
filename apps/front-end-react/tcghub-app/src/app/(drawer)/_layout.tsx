import { Drawer } from 'expo-router/drawer';
import { Drawer as PaperDrawer, Avatar, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useSegments, Href } from 'expo-router';
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
	<View style={{ flex: 1 }}>

      <PaperDrawer.Section title="Navigation">

		<PaperDrawer.Item
          label="Home"
		  icon="home"
		  active={currentRoute === 'home'}
          onPress={() => navigateTo('/home')}
		/>

		<PaperDrawer.Item
          label="Cards"
		  icon="cards"
		  active={currentRoute === 'cards'}
          onPress={() => navigateTo('/cards')}
		/>

		<PaperDrawer.Item
          label="Decks"
		  icon="layers"
		  active={currentRoute === 'decks'}
          onPress={() => navigateTo('/decks')}
		/>

		<PaperDrawer.Item
          label="Players"
		  icon="human"
		  active={currentRoute === 'players'}
          onPress={() => navigateTo('/players')}
		/>

		<PaperDrawer.Item
          label="Chat"
		  icon="chat"
		  active={currentRoute === 'cards'}
          onPress={() => navigateTo('/cards')}
		/>

		<PaperDrawer.Item
          label="Collection"
		  icon="book-open-page-variant"
		  active={currentRoute === 'collection'}
          onPress={() => navigateTo('/collection')}
		/>

		<PaperDrawer.Item
          label="Trades"
		  icon="handshake"
		  active={currentRoute === 'trades'}
          onPress={() => navigateTo('/trades')}
		/>

      </PaperDrawer.Section >

	  <View style={styles.content} >

		<PaperDrawer.Section title="Account">

		  <PaperDrawer.Item
			label="Settings"
			icon="cog"
			active={currentRoute === 'settings'}
			onPress={() => navigateTo('/settings')}
		  />
		</PaperDrawer.Section>

		<PaperDrawer.Section >
		  <PaperDrawer.Item
			label="Profile"
			icon="wizard-hat"
			active={currentRoute === 'decks'}
			onPress={() => navigateTo('/decks')}
		  />

		</PaperDrawer.Section>

	  </View>

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

const styles = StyleSheet.create({
  content: {
	flex: 1,
	justifyContent: 'flex-end',
  },
});
