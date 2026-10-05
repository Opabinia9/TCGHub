import { Drawer } from 'expo-router/drawer';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DrawerLayout() {
  const theme = useTheme();
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
        drawerStyle: { backgroundColor: theme.colors.surface },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.onSurfaceVariant,
        drawerActiveBackgroundColor: theme.colors.secondaryContainer,
      }}
    >
      <Drawer.Screen
        name="Home"
        options={{
          headerTitle: 'TCGHub',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Cards"
        options={{
          headerTitle: 'Cards',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="account" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Decks"
        options={{
          headerTitle: 'Decks',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="cog" color={color} size={size} />,
        }}
      />
	  <Drawer.Screen
        name="Players"
        options={{
          headerTitle: 'Players',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Chat"
        options={{
          headerTitle: 'Chat',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="cog" color={color} size={size} />,
        }}
      />
	  <Drawer.Screen
        name="Collection"
        options={{
          headerTitle: 'Collection',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Trades"
        options={{
          headerTitle: 'Trades',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="account" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Profile"
        options={{
          headerTitle: 'Profile',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="cog" color={color} size={size} />,
        }}
      />
    </Drawer>
  );
}
