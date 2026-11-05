
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { unreadCount } from '@/data/chats';
import { WishlistProvider } from "@/context/WishlistContext";

export default function TabsLayout() {
  return (
    <WishlistProvider>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E2D7BD',
        tabBarInactiveTintColor: '#A79E8B',
        tabBarStyle: {
          backgroundColor: '#171717',
          borderTopColor: '#171717',
          paddingTop: 7,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Cards',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="copy" size={size} color={String(color)} />
          ),
        }}
      />

      <Tabs.Screen
        name="decks"
        options={{
          title: 'Decks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="layers" size={size} color={String(color)} />
          ),
        }}
      />

      <Tabs.Screen
        name="trade"
        options={{
          title: 'Trades',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="swap-horiz" size={size} color={String(color)} />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#2e7d32', color: '#FFFFFF' },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" size={size} color={String(color)} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={String(color)} />
          ),
        }}
      />
    </Tabs>
    </WishlistProvider>
  );
}
