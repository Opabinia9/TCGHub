import { ReactNode, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatStyles } from '@/constants/chatStyles';
import { authClient } from '@/utils/auth-client';
import {
  ChatWithMessages,
  fetchChats,
  fetchChat,
  Message,
  updateLastReadMessage,
} from '@/api/chats';
import { fetchTrade } from '@/api/tradeListings';
import { MagicCard, UserCard } from '@/api/types';
import { useWS } from '@/api/WSProvider';
import { ChatRow } from './chat-row';

type Props = { query: string };
export default function ChatList(props: Props): ReactNode {
  const selfId = authClient.useSession().data?.user.id;
  const trades: { [key: string]: (UserCard & { Card: MagicCard }) | undefined } = {};
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const {
    refetch: chatRefetch,
    data: chatsList,
    isPending: chatIsPending,
  } = useQuery({
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
        .sort((a, b) => {
          return (b?.messages.at(-1)?.createdAt ?? b?.createdAt ?? '').localeCompare(
            a?.messages.at(-1)?.createdAt ?? a?.createdAt ?? '',
          );
        }),
  });

  useQueries({
    queries:
      chatsList
        ?.filter((chat) => chat.type === 'TRADE')
        .map((trade) => ({
          queryKey: ['trade', trade.sellerId, trade.cardId],
          queryFn: () => fetchTrade(trade.sellerId ?? '', trade.cardId ?? ''),
          staleTime: 60_000,
        })) ?? [],
    combine: (trades) => trades.map((trade) => trade.data),
  }).forEach((trade) => (trades[`${trade?.user_id}:${trade?.card_id}`] = trade));

  const refreshChats = async () => {
    setRefreshing(true);
    await chatRefetch();
    await queryClient.refetchQueries({ queryKey: ['chats'] });
    setRefreshing(false);
  };

  if (!chats) {
    return (
      <View>{chatIsPending ? <Text>Loading...</Text> : <Text>Error Loading Chats</Text>}</View>
    );
  }

  return (
    <FlatList
      style={chatStyles.list}
      data={chats.filter((chat) => {
        return (
          chat &&
          (
            chat.name ?? chat.members.reduce((acc, cur) => (cur.id === selfId ? cur : acc)).username
          ).includes(props.query.trim() ? props.query : '')
        );
      })}
      renderItem={({ item }) => <ChatRow chat={item} trades={trades} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshChats} />}
    />
  );
}
