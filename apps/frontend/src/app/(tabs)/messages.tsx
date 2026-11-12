import { useState } from 'react';
import { View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import ChatList from '@/components/ChatList';
import ScreenHeader from '@/components/screen-header';
import { layout } from '@/constants/theme';
import { searchStyles } from '@/constants/search-filter-styles';

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={layout.screen}>
      <ScreenHeader title="MESSAGES" subtitle="Chats with buyers, sellers and traders." />
      <View style={layout.top}>
        <View style={{ paddingVertical: 5 }}>
          <Searchbar
            placeholder="Search messages…"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={searchStyles.searchbar}
            inputStyle={searchStyles.searchInput}
            iconColor="#245f28"
            placeholderTextColor="#7A705F"
            selectionColor="#171717"
            cursorColor="#171717"
            elevation={0}
          />
        </View>
        <ChatList query={searchQuery} />
      </View>
    </View>
  );
}
