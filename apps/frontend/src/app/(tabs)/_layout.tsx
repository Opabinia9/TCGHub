import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { WishlistProvider } from '@/context/WishlistContext';
import {
  fetchChats,
  fetchChat,
  ChatWithMessages,
  Message,
  updateLastReadMessage,
  Chat,
} from '@/api/chats';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authClient } from '@/utils/auth-client';
import { Palette } from '@/constants/theme';
import { useWS } from '@/api/WSProvider';

export default function TabsLayout() {
  const queryClient = useQueryClient();
  const webSocketService = useWS();
  const insets = useSafeAreaInsets();
  const selfId = authClient.useSession().data?.user.id;
  const { refetch: chatRefetch, data: chatsList } = useQuery({
    queryKey: ['chats', selfId],
    queryFn: fetchChats,
  });
  const chats: Array<ChatWithMessages | undefined> = useQueries({
    queries:
      chatsList?.map((chat) => ({
        queryKey: ['chats', chat.id, selfId],
        queryFn: async () => {
          return await fetchChat(chat.id);
        },
        staleTime: 60_000,
      })) ?? [],
    combine: (chats) =>
      chats
        .map((chat) => chat.data)
        .sort((a, b) =>
          (b?.messages.at(-1)?.createdAt ?? b?.createdAt ?? '').localeCompare(
            a?.messages.at(-1)?.createdAt ?? a?.createdAt ?? '',
          ),
        ),
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

  useEffect(() => {
    const addMessage = async ({ message }: { message: Message }) => {
      await queryClient.cancelQueries({ queryKey: ['chats', message.chatId, selfId] });
      await queryClient.setQueryData(
        ['chats', message.chatId, selfId],
        (old: ChatWithMessages | undefined) => {
          return { ...old, messages: old ? [...old.messages, message] : [message] };
        },
      );
    };

    webSocketService.on('newMessage', addMessage);
    webSocketService.on('messageSent', async ({ message }: { message: Message }) => {
      await addMessage({ message });
      await queryClient.cancelQueries({ queryKey: ['chats', message.chatId, selfId] });
      queryClient.setQueryData(
        ['chats', message.chatId, selfId],
        (old: ChatWithMessages | undefined) => {
          return { ...old, lastReadMessageId: message.id };
        },
      );
      await updateLastReadMessage(message.chatId, message.id);
    });
    webSocketService.on('newChat', async ({ chat }: { chat: Chat }) => {
      await chatRefetch();
    });

    return () => {
      webSocketService.off('newChat');
      webSocketService.off('newMessage');
      webSocketService.off('messageSent');
    };
  }, [webSocketService.on, webSocketService.off]);

  return (
    <WishlistProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Palette.gold,
          tabBarInactiveTintColor: Palette.textSecondary,
          tabBarStyle: {
            backgroundColor: Palette.background,
            borderTopColor: Palette.border,
            borderTopWidth: 1,
            paddingTop: 7,
            paddingBottom: insets.bottom,
            height: 60 + insets.bottom,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
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
            tabBarBadgeStyle: {
              backgroundColor: Palette.greenAccent,
              color: Palette.white,
            },
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
