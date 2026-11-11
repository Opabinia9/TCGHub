import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ListViewToken,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { authClient } from '@/utils/auth-client';
import { dateStringToMessageDate } from '@/components/ChatList';
import {
  Chat,
  fetchChat,
  fetchChats,
  fetchMessages,
  Message,
  sendMessage,
  updateLastReadMessage,
} from '@/api/chats';
import { FlatList } from 'react-native-gesture-handler';
import { useQuery } from '@tanstack/react-query';
import { fetchTrade } from '@/api/tradeListings';

const QUICK_REPLIES = ['Propose a trade', 'Suggest a meetup', 'Still available?'];

export default function ChatScreen() {
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const selfId = authClient.useSession().data?.user.id;
  const [chat, setChat] = useState<Chat>();
  const [draft, setDraft] = useState('');
  const messagesRef = useRef<FlatList>(null);
  const hasViewedLatest = useRef(false);
  const insets = useSafeAreaInsets();
  const { refetch: chatRefetch } = useQuery({
    queryKey: ['chats'],
    queryFn: fetchChats,
  });
  const { refetch: messageRefetch, data: messages } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => await fetchMessages(chatId),
  });
  const { data: trade } = useQuery({
    queryKey: ['trade', chat?.sellerId, chat?.cardId],
    queryFn: () => fetchTrade(chat?.sellerId ?? '', chat?.cardId ?? ''),
  });
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<ListViewToken> }) => {
      if (chat != null) {
        if (!hasViewedLatest.current && viewableItems.some((v) => v.index === 0 && v.isViewable)) {
          const message = viewableItems[0].item.props.message;
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

  const renderMessage = ({ item }: { item: any }) => {
    return item;
  };

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    const message = await sendMessage(chatId, text);
    await updateLastReadMessage(chatId, message.id);
    await messageRefetch();
    await chatRefetch();
    setDraft('');
  };

  if (chat === undefined) {
    return (
      <View style={styles.screen}>
        <Text style={styles.notFound}>Chat not found.</Text>
      </View>
    );
  }

  if (!messages) {
    return (
      <View style={styles.screen}>
        <Text style={styles.notFound}>Loading.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top - insets.bottom : 50}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back to messages"
          style={styles.iconButton}
        >
          <Ionicons name="chevron-back" size={26} color="#171717" />
        </Pressable>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {
              (chat.name ??
                chat.members.reduce((acc, cur) => (cur.id === selfId ? cur : acc)).username)[0]
            }
          </Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>
            {chat.name ??
              chat.members.reduce((acc, cur) => (cur.id === selfId ? cur : acc)).username}
          </Text>
          {chat.type === 'TRADE' ? (
            <Text style={styles.distance}>DISTANCE NOT IMPLEMENTED</Text>
          ) : null}
        </View>
        {/* NOTE: this currently does nothing */}
        <Pressable
          onPress={() => console.log('More options pressed')}
          accessibilityRole="button"
          accessibilityLabel="More options"
          style={styles.iconButton}
        >
          <Ionicons name="ellipsis-vertical" size={22} color="#171717" />
        </Pressable>
      </View>

      {/* The listing this chat is about */}
      <View>
        {chat.type === 'TRADE' ? (
          <Pressable
            onPress={() => console.log('View listing', chat.cardId)}
            accessibilityRole="button"
            accessibilityLabel={`View listing: ${chat.cardId}`}
            style={styles.listing}
          >
            {/* TODO: better background color */}
            <View style={styles.listingThumbFrame}>
              <View style={[styles.listingThumb, { backgroundColor: '#FF0000' }]} />
              <Image
                source={{
                  uri: trade?.Card.imageUris?.small ?? trade?.Card.imageUris?.normal ?? undefined,
                }}
                style={styles.cardImage}
                contentFit="cover"
              />
            </View>
            <View style={styles.listingText}>
              <Text style={styles.listingName}>{trade?.Card.name}</Text>
              <Text style={styles.listingDetail}>{trade?.condition}</Text>
            </View>
            <Text style={styles.listingLink}>View listing</Text>
          </Pressable>
        ) : null}
      </View>

      {/* messages in the chat */}
      <FlatList
        inverted
        ref={messagesRef}
        style={styles.messageScroll}
        data={messages.map((message) => <MessageBubble message={message} />).reverse()}
        renderItem={renderMessage}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Quick replies + typing box */}
      <View style={[styles.composer, { paddingBottom: insets.bottom + 10 }]}>
        {chat.type === 'TRADE' ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickReplies}
          >
            {QUICK_REPLIES.map((reply) => (
              <Pressable
                key={reply}
                onPress={() => setDraft(reply)}
                accessibilityRole="button"
                style={styles.quickReply}
              >
                <Text style={styles.quickReplyText}>{reply}</Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : null}

        <View style={styles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={send}
            placeholder="Message…"
            placeholderTextColor="#7A705F"
            selectionColor="#171717"
            cursorColor="#171717"
            returnKeyType="send"
            accessibilityLabel={`Message ${chat.name}`}
            style={styles.input}
          />
          <Pressable
            onPress={send}
            disabled={!draft.trim()}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            style={[styles.sendButton, !draft.trim() && styles.sendButtonDisabled]}
          >
            <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const selfId = authClient.useSession().data?.user.id;
  const MessageDateString: string = dateStringToMessageDate(message.createdAt ?? null, 'SPECIFIC');

  return (
    <View>
      <View
        style={[
          styles.bubbleWrap,
          message.senderId === selfId ? styles.bubbleWrapMine : styles.bubbleWrapTheirs,
        ]}
      >
        <View
          style={[
            styles.bubble,
            message.senderId === selfId ? styles.bubbleMine : styles.bubbleTheirs,
          ]}
        >
          <Text style={[styles.bubbleText, message.senderId === selfId && styles.bubbleTextMine]}>
            {message.body}
          </Text>
        </View>
        <Text style={styles.bubbleTime}>{MessageDateString}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E2D7BD',
  },
  notFound: {
    marginTop: 40,
    textAlign: 'center',
    color: '#5A5246',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#C9BB98',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 15,
    color: '#E2D7BD',
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#171717',
  },
  distance: {
    fontSize: 13,
    color: '#5A5246',
  },

  listing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#C9BB98',
    backgroundColor: '#EFE7D4',
  },
  listingThumbFrame: {
    width: 34,
    height: 46,
    padding: 2,
    borderRadius: 5,
    backgroundColor: '#171717',
  },
  listingThumb: {
    flex: 1,
    borderRadius: 3,
  },
  listingText: {
    flex: 1,
    minWidth: 0,
  },
  listingName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
  },
  listingDetail: {
    fontSize: 12,
    color: '#5A5246',
  },
  listingLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#245f28',
  },

  messageScroll: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    gap: 8,
  },
  dayLabel: {
    alignSelf: 'center',
    marginBottom: 4,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.7,
    color: '#5A5246',
  },
  bubbleWrap: {
    maxWidth: '78%',
    gap: 2,
  },
  bubbleWrapMine: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  bubbleWrapTheirs: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  bubbleMine: {
    backgroundColor: '#171717',
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: '#EFE7D4',
    borderWidth: 1,
    borderColor: '#C9BB98',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#171717',
  },
  bubbleTextMine: {
    color: '#E2D7BD',
  },
  bubbleTime: {
    fontSize: 11,
    color: '#5A5246',
  },

  composer: {
    gap: 8,
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#C9BB98',
  },
  quickReplies: {
    gap: 8,
  },
  quickReply: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#171717',
    justifyContent: 'center',
  },
  quickReplyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#171717',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: '#B9A985',
    backgroundColor: '#EFE7D4',
    fontSize: 16,
    color: '#171717',
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e7d32',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
});
