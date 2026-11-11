import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import ChatList from '@/components/ChatList';
import ScreenHeader from '@/components/screen-header';

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.screen}>
      <ScreenHeader title='MESSAGES' subtitle='Chats with buyers, sellers and traders.' />

      <Searchbar
        placeholder='Search messages…'
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
        iconColor='#245f28'
        placeholderTextColor='#7A705F'
        selectionColor='#171717'
        cursorColor='#171717'
        elevation={0}
      />
      <ChatList query={searchQuery} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E2D7BD',
    paddingHorizontal: 6,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 48,
    lineHeight: 50,
    color: '#171717',
  },
  subtitle: {
    fontSize: 14,
    color: '#5A5246',
  },
    searchbar: {
    marginTop: 16,
    marginHorizontal: 20,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#B9A985',
    backgroundColor: '#EFE7D4',
  },
  searchInput: {
    minHeight: 0,
    fontSize: 15,
    color: '#171717',
  },

  list: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#C9BB98',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#C9BB98',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 17,
    color: '#E2D7BD',
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
  },
  time: {
    fontSize: 12,
    color: '#5A5246',
  },
  about: {
    fontSize: 12,
    fontWeight: '600',
    color: '#245f28',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  preview: {
    flex: 1,
    fontSize: 14,
    color: '#5A5246',
  },
  previewUnread: {
    fontWeight: '600',
    color: '#171717',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2e7d32',
  },
  emptyMessage: {
    marginTop: 24,
    textAlign: 'center',
    color: '#5A5246',
  },
});
