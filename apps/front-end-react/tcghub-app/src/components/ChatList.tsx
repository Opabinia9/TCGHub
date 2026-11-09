import { ChatWithMessages, fetchChats, Message } from '@/api/chats';
import { authClient } from '@/utils/auth-client';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ReactNode, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';

export type Props = { query: string };
export default function ChatList(props: Props): ReactNode {
  const [refreshing, setRefreshing] = useState(false);
  const {
    refetch: chatRefetch,
    data: chats,
    isPending: chatIsPending,
    status: chatStatus,
  } = useQuery({
    queryKey: ['chats'],
    queryFn: fetchChats,
  });

  useEffect(() => {
    refreshChats();
    return () => {};
  }, []);

  const refreshChats = async () => {
    setRefreshing(true);
    await chatRefetch();
    setRefreshing(false);
  };
  const renderChats = ({ item }: { item: any }) => {
    return item;
  };

  if (!chats && chatIsPending) {
    console.log(chatStatus);
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
      style={styles.list}
      data={chats
        .filter((chat) => chat.name.includes(props.query))
        .map((chat) => (
          <ChatRow chat={chat} />
        ))}
      renderItem={renderChats}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshChats} />
      }
    />
  );
}

export function dateStringToMessageDate(
  dateString: string | null,
  type: 'SPECIFIC' | 'GENERAL',
) {
  if (dateString == null) {
    return '';
  }
  const date = new Date(dateString);
  const now = new Date();
  if (
    date.getFullYear() == now.getFullYear() &&
    date.getMonth() == now.getMonth() &&
    date.getDate() >= now.getDate()
  ) {
    const minute = date.getMinutes();
    return `${date.getHours()}:${minute < 10 ? `0${minute}` : minute}`;
  } else if (
    date.getTime() >
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime()
  ) {
    if (type === 'GENERAL') {
      return `${date.toLocaleDateString('en-au', { weekday: 'short' })}`;
    } else if (type === 'SPECIFIC') {
      const minute = date.getMinutes();
      return `${date.toLocaleDateString('en-au', { weekday: 'short' })} ${date.getHours()}:${minute < 10 ? `0${minute}` : minute}`;
    } else {
      return "FIX ME, I'M IN dateStringToMessageDate";
    }
  } else {
    return "FIX ME, I'M IN dateStringToMessageDate";
  }
}

function ChatRow({ chat }: { chat: ChatWithMessages }) {
  const chatTitle: string = chat.sellerId
    ? `Trade for ${chat.name}`
    : chat.name;
  const selfId = authClient.useSession().data?.user.username;
  const last = chat.messages.at(-1);
  const lastDateString: string = dateStringToMessageDate(
    last?.createdAt ?? null,
    'GENERAL',
  );
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
      onPress={() =>
        router.push({ pathname: '/chat/[id]', params: { id: chat.id } })
      }
      accessibilityRole='button'
      accessibilityLabel={`${chatTitle}, about ${chat.name}${unread ? ', unread' : ''}: ${preview}`}
      style={styles.row}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{chatTitle[0]}</Text>
      </View>

      <View style={styles.rowText}>
        <View style={styles.rowTop}>
          <Text style={styles.name}>{chatTitle}</Text>
          <Text style={styles.time}>{lastDateString}</Text>
        </View>
        <Text style={styles.about}>
          {chat.name != null ? `About: ${chat.name}` : ''}
        </Text>
        <View style={styles.previewRow}>
          <Text
            style={[styles.preview, chat.type && styles.previewUnread]}
            numberOfLines={1}
          >
            {preview}
          </Text>
          {unread > 0 && <View style={styles.unreadDot} />}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E2D7BD',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 48,
    lineHeight: 50,
    color: '#171717',
  },
  subtitle: {
    fontSize: 14,
    color: '#5A5246',
  },
  searchbar: {
    marginTop: 16,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#B9A985',
    backgroundColor: '#EFE7D4',
  },
  searchInput: {
    minHeight: 0,
    fontSize: 15,
    color: '#171717',
  },

  // List
  list: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#C9BB98',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#C9BB98',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 17,
    color: '#E2D7BD',
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
  },
  time: {
    fontSize: 12,
    color: '#5A5246',
  },
  about: {
    fontSize: 12,
    fontWeight: '600',
    color: '#245f28',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  preview: {
    flex: 1,
    fontSize: 14,
    color: '#5A5246',
  },
  previewUnread: {
    fontWeight: '600',
    color: '#171717',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2e7d32',
  },
  emptyMessage: {
    marginTop: 24,
    textAlign: 'center',
    color: '#5A5246',
  },
});
