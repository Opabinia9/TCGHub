import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import ChatList from '@/components/ChatList';
import { chatStyles } from '@/constants/chatStyles';

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={chatStyles.screen}>
      <Text style={chatStyles.title}>MESSAGES</Text>
      {/* <Text style={chatStyles.subtitle}>Chats with buyers, sellers and traders.</Text> */}

      <Searchbar
        placeholder="Search messages…"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={chatStyles.searchbar}
        inputStyle={chatStyles.searchInput}
        iconColor="#245f28"
        placeholderTextColor="#7A705F"
        selectionColor="#171717"
        cursorColor="#171717"
        elevation={0}
      />
      <ChatList query={searchQuery} />
    </View>
  );
}
