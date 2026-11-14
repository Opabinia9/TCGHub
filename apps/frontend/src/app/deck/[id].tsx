import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import CardList from '@/components/card-list';
import ScreenHeader from '@/components/screen-header';
import { Palette, layout } from '@/constants/theme';
import { searchStyles } from '@/constants/search-filter-styles';
import { fetchDeck } from '@/api/decks';
import BackArrow from '@/components/back-arrow';

export default function DeckScreen() {
  // Params can be string | string[], so normalise.
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const deckId = Array.isArray(id) ? id[0] : id;
  const deckName = Array.isArray(name) ? name[0] : name;
  const fetchlist = useMemo(() => fetchDeck(deckId), [deckId]);

  const [searchQuery, setSearchQuery] = useState('');

  // CardList calls fetchlist(search, filter, page, limit).
  // fetchDeck wants deck_id first, so wrap it. useCallback keeps the
  // function identity stable. CardList's fetch effect depends on
  // props.fetchlist, so an unstable function would refetch every render.

  return (
    <View style={layout.screen}>
      <ScreenHeader
        title={(deckName ?? 'DECK').toUpperCase()}
        subtitle='Cards in this deck.'
        right={<BackArrow />}
      />

      <View style={layout.top}>
        <View style={{ paddingBottom: 5 }}>
          <Searchbar
            placeholder='Search this deck…'
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

        <CardList
          fetchlist={fetchlist}
          query={searchQuery}
          activeFilter='all'
          emptyMessage='This deck has no cards yet'
          refreshOnFocus
        />
      </View>
    </View>
  );
}
