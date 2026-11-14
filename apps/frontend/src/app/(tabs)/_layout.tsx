import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { WishlistProvider } from '@/context/WishlistContext';
import { fetchChats, fetchChat } from '@/api/chats';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authClient } from '@/utils/auth-client';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const selfId = authClient.useSession().data?.user.id;
  const { data: chatsList } = useQuery({
    queryKey: ['chats', selfId],
    queryFn: fetchChats,
  });
  const chats = useQueries({
    queries:
      chatsList?.map((chat) => ({
        queryKey: ['chats', chat.id, selfId],
        queryFn: async () => {
          return await fetchChat(chat.id);
        },
      })) ?? [],
    combine: (chats) => chats.map((chat) => chat.data),
  });

  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    if (chats) {
      let count = 0;
      for (const chat of chats) {
        if (chat) {
          count +=
            chat.messages.length -
            (chat.messages
              .map((message) => {
                return message.id;
              })
              .indexOf(chat.lastReadMessageId) +
              1);
        }
      }
      setUnreadCount(count);
    }
  }, [chats]);

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
            paddingBottom: insets.bottom,
            height: 60 + insets.bottom,
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
