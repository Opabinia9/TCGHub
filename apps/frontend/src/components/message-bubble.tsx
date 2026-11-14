import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { chatStyles } from '@/constants/chatStyles';
import { authClient } from '@/utils/auth-client';
import { dateStringToMessageDate } from '@/utils/dateStringToMessageDate';
import { Message } from '@/api/chats';

export function MessageBubble({ message }: { message: Message }) {
  const selfId = authClient.useSession().data?.user.id;
  const senderSelf = message.senderId === selfId;
  const MessageDateString: string = dateStringToMessageDate(message.createdAt ?? null, 'SPECIFIC');

  return (
    <View>
      <View
        style={[
          chatStyles.bubbleWrap,
          senderSelf ? chatStyles.bubbleWrapMine : chatStyles.bubbleWrapTheirs,
        ]}
      >
        <View
          style={[chatStyles.bubble, senderSelf ? chatStyles.bubbleMine : chatStyles.bubbleTheirs]}
        >
          <Text style={[chatStyles.bubbleText, senderSelf && chatStyles.bubbleTextMine]}>
            {message.body}
          </Text>
        </View>
        <Text style={chatStyles.bubbleTime}>{MessageDateString}</Text>
      </View>
    </View>
  );
}
