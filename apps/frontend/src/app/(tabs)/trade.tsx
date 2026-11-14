import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import TradeList from '@/components/trade-list';
import ScreenHeader from '@/components/screen-header';
import { layout, Palette } from '@/constants/theme';
import { searchStyles } from '@/constants/search-filter-styles';

export default function TradeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title='LISTED CARDS'
        subtitle='Buy, sell and trade with players near you.'
        right={
          <Pressable
            onPress={() =>
              router.navigate({
                pathname: '/(tabs)/decks',
                params: { tab: 'collection' },
              })
            }
            accessibilityRole='button'
            accessibilityLabel='List a card'
            style={styles.listButton}
          >
            <Ionicons name='add' size={18} color={Palette.white} />
            <Text style={styles.listButtonText}>LIST A CARD</Text>
          </Pressable>
        }
      />

      <View style={[layout.top, { flex: 0 }]}>
        <Searchbar
          placeholder='Search listed cards…'
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
      </View>

      <TradeList query={searchQuery} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  top: {
    paddingHorizontal: 20,
  },
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 44,
    paddingLeft: 10,
    paddingRight: 14,
    borderRadius: 12,
    backgroundColor: Palette.greenAccent,
    borderWidth: 1,
    borderColor: Palette.gold,
  },
  listButtonText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 15,
    letterSpacing: 1.2,
    color: Palette.white,
  },
});
