import { ReactNode, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { FlatList, Pressable, RefreshControl } from 'react-native-gesture-handler';
import { useQueries, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { chatStyles } from '@/constants/chatStyles';
import { authClient } from '@/utils/auth-client';
import { dateStringToMessageDate } from '@/utils/dateStringToMessageDate';
import { ChatWithMessages, fetchChats } from '@/api/chats';
import { fetchTrade } from '@/api/tradeListings';
import { MagicCard, UserCard } from '@/api/types';

type Props = { query: string };
export default function ChatList(props: Props): ReactNode {
  const selfId = authClient.useSession().data?.user.id;
  const trades: { [key: string]: (UserCard & { Card: MagicCard }) | undefined } = {};
  const [refreshing, setRefreshing] = useState(false);
  const {
    refetch: chatRefetch,
    data: chats,
    isPending: chatIsPending,
  } = useQuery({
    queryKey: ['chats', selfId],
    queryFn: fetchChats,
  });

  useQueries({
    queries:
      chats
        ?.filter((chat) => chat.type === 'TRADE')
        .map((chat) => {
          return { sellerId: chat.sellerId, cardId: chat.cardId };
        })
        .map((trade) => ({
          queryKey: ['trade', trade.sellerId, trade.cardId],
          queryFn: () => fetchTrade(trade.sellerId ?? '', trade.cardId ?? ''),
        })) ?? [],
    combine: (trades) => trades.map((trade) => trade.data),
  }).forEach((trade) => (trades[`${trade?.user_id}:${trade?.card_id}`] = trade));

  useEffect(() => {
    refreshChats();
    return () => {};
  }, []);

  const refreshChats = async () => {
    setRefreshing(true);
    await chatRefetch();
    setRefreshing(false);
  };
  const renderChat = ({ item: chat }: { item: ChatWithMessages }) => {
    const cardId = chat.cardId;
    const sellerId = chat.sellerId;
    const selfIsSeller = selfId === sellerId;
    const cardName = `${trades[`${sellerId}:${cardId}`]?.Card.name}`;
    const chatTitle: string =
      chat.name ?? chat.members.reduce((acc, cur) => (cur.id !== selfId ? cur : acc)).username;
    const last = chat.messages.at(-1);
    const lastDateString: string = dateStringToMessageDate(last?.createdAt ?? null, 'GENERAL');
    const unread =
      chat.messages.length -
      (chat.messages
        .map((message) => {
          return message.id;
        })
        .indexOf(chat.lastReadMessageId) +
        1);
    const preview = last
      ? last.senderId === selfId
        ? `You: ${last.body}`
        : `${last.body}`
      : 'No messages yet';

    return (
      <Pressable
        onPress={() => router.push({ pathname: '/chat/[id]', params: { id: chat.id } })}
        accessibilityRole="button"
        accessibilityLabel={`${chatTitle}, about ${cardName}${unread ? ', unread' : ''}: ${preview}`}
        style={chatStyles.row}
      >
        <View
          style={
            chat.type === 'TRADE'
              ? selfIsSeller
                ? chatStyles.avatarBuyer
                : chatStyles.avatarSeller
              : chatStyles.avatar
          }
        >
          <Text style={chatStyles.avatarText}>{chatTitle[0].toUpperCase()}</Text>
        </View>

        <View style={chatStyles.rowText}>
          <View style={chatStyles.rowTop}>
            <Text style={chatStyles.name}>{chatTitle}</Text>
            <Text style={chatStyles.time}>{lastDateString}</Text>
          </View>
          <Text style={chatStyles.about}>
            {chat.type === 'TRADE' ? `About: ${cardName}` : null}
          </Text>
          <View style={chatStyles.previewRow}>
            <Text
              style={[chatStyles.preview, chat.type && chatStyles.previewUnread]}
              numberOfLines={1}
            >
              {preview}
            </Text>
            {unread > 0 && <View style={chatStyles.unreadDot} />}
          </View>
        </View>
      </Pressable>
    );
  };

  if (!chats && chatIsPending) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!chats && !chatIsPending) {
    return (
      <View>
        <Text>Error Loading Chats</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={chatStyles.list}
      data={chats.filter((chat) => {
        return (
          chat.name ?? chat.members.reduce((acc, cur) => (cur.id === selfId ? cur : acc)).username
        ).includes(props.query.trim() ? props.query : '');
      })}
      renderItem={renderChat}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshChats} />}
    />
  );
}
