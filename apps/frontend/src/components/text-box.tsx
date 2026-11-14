import { Dispatch, SetStateAction } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { chatStyles } from '@/constants/chatStyles';
import { ChatWithMessages } from '@/api/chats';
import { useWS } from '@/api/WSProvider';
type Props = {
  chat: ChatWithMessages;
  draftState: { draft: string; setDraft: Dispatch<SetStateAction<string>> };
};
export function TextBox({ chat, draftState: { draft, setDraft } }: Props) {
  const webSocketService = useWS();

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    webSocketService.emit('message', { chatId: chat.id, body: text });
    setDraft('');
  };

  return (
    <View style={chatStyles.inputRow}>
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
        style={chatStyles.input}
      />
      <Pressable
        onPress={send}
        disabled={!draft.trim()}
        accessibilityRole="button"
        accessibilityLabel="Send message"
        style={[chatStyles.sendButton, !draft.trim() && chatStyles.sendButtonDisabled]}
      >
        <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
