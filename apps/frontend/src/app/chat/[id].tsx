
import { useCallback, useEffect, useRef, useState } from 'react';
import { ListViewToken, Platform, Pressable, TextInput, View } from 'react-native';
import { Text } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import MessageListing from '@/components/message-listing';
import QuickReply from '@/components/quick-reply';
import BackArrrow from '@/components/back-arrow';
import { chatStyles } from '@/constants/chatStyles';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { authClient } from '@/utils/auth-client';
import { dateStringToMessageDate } from '@/utils/dateStringToMessageDate';
import { Palette } from '@/constants/theme';
import {
  Chat,
  fetchChat,
  fetchChats,
  fetchMessages,
  Message,
  sendMessage,
  updateLastReadMessage,
} from '@/api/chats';

const QUICK_REPLIES = ['Propose a trade', 'Suggest a meetup', 'Still available?'];

export default function ChatScreen() {
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const selfId = authClient.useSession().data?.user.id;
  const [chat, setChat] = useState<Chat>();
  const [draft, setDraft] = useState('');
  const messagesRef = useRef<FlatList>(null);
  const hasViewedLatest = useRef(false);
  const insets = useSafeAreaInsets();
  const selfIsSeller = selfId === chat?.sellerId;
  const chatTitle: string =
    chat?.name ??
    chat?.members.reduce((acc, cur) => (cur.id !== selfId ? cur : acc)).username ??
    '';

  const { refetch: chatRefetch } = useQuery({
    queryKey: ['chats', selfId],
    queryFn: fetchChats,
  });

  const { refetch: messageRefetch, data: messages } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => await fetchMessages(chatId),
  });

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<ListViewToken> }) => {
      if (chat != null) {
        if (!hasViewedLatest.current && viewableItems.some((v) => v.index === 0 && v.isViewable)) {
          const message = viewableItems[0].item;
          if (message != null && message.id != chat.lastReadMessageId) {
            updateLastReadMessage(chat.id, message.id);
          }
          hasViewedLatest.current = true;
        }
      }
    },
    [chat],
  );

  useEffect(() => {
    fetchChat(chatId).then((chat) => {
      setChat(chat);
    });
    messageRefetch();
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    const message = await sendMessage(chatId, text);
    await updateLastReadMessage(chatId, message.id);
    await messageRefetch();
    await chatRefetch();
    setDraft('');
  };

  const renderMessage = ({ item: message }: { item: Message }) => {
    const senderSelf = message.senderId === selfId;
    const MessageDateString: string = dateStringToMessageDate(
      message.createdAt ?? null,
      'SPECIFIC',
    );

    return (
      <View>
        <View
          style={[
            chatStyles.bubbleWrap,
            senderSelf ? chatStyles.bubbleWrapMine : chatStyles.bubbleWrapTheirs,
          ]}
        >
          <View
            style={[
              chatStyles.bubble,
              senderSelf ? chatStyles.bubbleMine : chatStyles.bubbleTheirs,
            ]}
          >
            <Text style={[chatStyles.bubbleText, senderSelf && chatStyles.bubbleTextMine]}>
              {message.body}
            </Text>
          </View>
          <Text style={chatStyles.bubbleTime}>{MessageDateString}</Text>
        </View>
      </View>
    );
  };

  if (chat === undefined) {
    return (
      <View style={chatStyles.screen}>
        <Text style={chatStyles.notFound}>Chat not found.</Text>
      </View>
    );
  }

  if (!messages) {
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
        data={messages.reverse()}
        renderItem={renderMessage}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={[chatStyles.composer, { paddingBottom: insets.bottom + 10 }]}>
        {chat.type === 'TRADE' && <QuickReply replies={QUICK_REPLIES} setDraft={setDraft} />}

        <View style={chatStyles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={send}
            placeholder="Message…"
            placeholderTextColor={Palette.textSecondary}
            selectionColor={Palette.gold}
            cursorColor={Palette.gold}
            returnKeyType="send"
            accessibilityLabel={`Message ${chat.name}`}
            style={chatStyles.input}
          />
          <Pressable
            onPress={send}
            disabled={!draft.trim()}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            style={[chatStyles.sendButton, !draft.trim() && chatStyles.sendButtonDisabled]}
          >
            <Ionicons name="arrow-up" size={22} color={Palette.white} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
