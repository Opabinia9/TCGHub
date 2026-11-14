import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { Pressable } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { chatStyles } from '@/constants/chatStyles';
import { authClient } from '@/utils/auth-client';
import { dateStringToMessageDate } from '@/utils/dateStringToMessageDate';
import { ChatWithMessages } from '@/api/chats';
import { MagicCard, UserCard } from '@/api/types';
type Props = {
  chat: ChatWithMessages | undefined;
  trades: { [key: string]: (UserCard & { Card: MagicCard }) | undefined };
};
export function ChatRow({ chat, trades }: Props) {
  if (!chat) {
    return (
      <Pressable style={chatStyles.row}>
        <View style={chatStyles.rowText}>
          <View style={chatStyles.rowTop}></View>
          <View style={chatStyles.previewRow}></View>
        </View>
      </Pressable>
    );
  }
  const selfId = authClient.useSession().data?.user.id;
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
        <Text style={chatStyles.about}>{chat.type === 'TRADE' ? `About: ${cardName}` : null}</Text>
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
}
