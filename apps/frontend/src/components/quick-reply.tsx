import { Dispatch, ReactNode, SetStateAction } from 'react';
import { Pressable, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { chatStyles } from '@/constants/chatStyles';

type Props = { replies: Array<string>; setDraft: Dispatch<SetStateAction<string>> };
export default function QuickReply({ replies, setDraft }: Props): ReactNode {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={chatStyles.quickReplies}
    >
      {replies.map((reply) => (
        <Pressable
          key={reply}
          onPress={() => setDraft(reply)}
          accessibilityRole="button"
          style={chatStyles.quickReply}
        >
          <Text style={chatStyles.quickReplyText}>{reply}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
