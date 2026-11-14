
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import ChatList from '@/components/ChatList';
import ScreenHeader from '@/components/screen-header';
import { Palette } from '@/constants/theme';
import { searchStyles } from '@/constants/search-filter-styles';

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="MESSAGES"
        subtitle="Chats with buyers, sellers and traders."
      />

      <View style={styles.top}>
        <Searchbar
          placeholder="Search messages…"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={searchStyles.searchbar}
          inputStyle={searchStyles.searchInput}
          iconColor={Palette.gold}
          placeholderTextColor={Palette.textSecondary}
          selectionColor={Palette.gold}
          cursorColor={Palette.gold}
          elevation={0}
        />

        <ChatList query={searchQuery} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  top: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
