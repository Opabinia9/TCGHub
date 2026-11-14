import { useCallback, useRef, useState } from 'react';
import { ListViewToken, Platform, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import MessageListing from '@/components/message-listing';
import QuickReply from '@/components/quick-reply';
import BackArrrow from '@/components/back-arrow';
import { MessageBubble } from '@/components/message-bubble';
import { TextBox } from '@/components/text-box';
import { chatStyles } from '@/constants/chatStyles';
import { Palette } from '@/constants/theme';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { authClient } from '@/utils/auth-client';
import { ChatWithMessages, fetchChat, updateLastReadMessage } from '@/api/chats';

const QUICK_REPLIES = ['Propose a trade', 'Suggest a meetup', 'Still available?'];

export default function ChatScreen() {
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const [draft, setDraft] = useState('');
  const messagesRef = useRef<FlatList>(null);
  const hasViewedLatest = useRef(false);
  const insets = useSafeAreaInsets();
  const selfId = authClient.useSession().data?.user.id;

  const queryClient = useQueryClient();
  const { data: chat } = useQuery({
    queryKey: ['chats', chatId, selfId],
    queryFn: async () => await fetchChat(chatId),
  });
  const selfIsSeller = selfId === chat?.sellerId;
  const chatTitle: string =
    chat?.name ??
    chat?.members.reduce((acc, cur) => (cur.id !== selfId ? cur : acc)).username ??
    '';
  const onViewableItemsChanged = useCallback(
    async ({ viewableItems }: { viewableItems: Array<ListViewToken> }) => {
      if (chat != null) {
        if (viewableItems.some((v) => v.index === 0 && v.isViewable)) {
          const message = viewableItems[0].item;
          if (message != null && message.id != chat.lastReadMessageId) {
            await queryClient.cancelQueries({ queryKey: ['chats', message.chatId, selfId] });
            queryClient.setQueryData(['chats', message.chatId, selfId], (old: ChatWithMessages) => {
              return { ...old, lastReadMessageId: message.id };
            });
            updateLastReadMessage(chat.id, message.id);
          }
          hasViewedLatest.current = true;
        }
      }
    },
    [chat],
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 10,
  }).current;

  if (chat === undefined) {
    return (
      <View style={chatStyles.screen}>
        <Text style={chatStyles.notFound}>Chat not found.</Text>
      </View>
    );
  }

  if (!chat.messages) {
    return (
      <View style={chatStyles.screen}>
        <Text style={chatStyles.notFound}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={chatStyles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top - insets.bottom : 50}
    >
      <View style={chatStyles.header}>
        <BackArrrow />
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
        <View style={chatStyles.headerText}>
          <Text style={chatStyles.name}>{chatTitle}</Text>
          {chat.type === 'TRADE' && (
            <Text style={chatStyles.distance}>DISTANCE NOT IMPLEMENTED</Text>
          )}
        </View>
        <Pressable
          onPress={() => console.log('More options pressed')}
          accessibilityRole="button"
          accessibilityLabel="More options"
          style={chatStyles.iconButton}
        >
          <Ionicons name="ellipsis-vertical" size={22} color={Palette.gold} />
        </Pressable>
      </View>

      <MessageListing sellerId={chat.sellerId} cardId={chat.cardId} />

      <FlatList
        inverted
        ref={messagesRef}
        style={chatStyles.messageScroll}
        data={chat.messages.toReversed()}
        renderItem={({ item }) => <MessageBubble message={item} />}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={[chatStyles.composer, { paddingBottom: insets.bottom + 10 }]}>
        {chat.type === 'TRADE' && <QuickReply replies={QUICK_REPLIES} setDraft={setDraft} />}

        {/* The box you type in and the send button */}
        <TextBox chat={chat} draftState={{ draft, setDraft }} />
      </View>
    </KeyboardAvoidingView>
  );
}
