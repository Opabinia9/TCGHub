import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { FilterOption, FILTERS } from '@/api/types';
import CardList from '@/components/card-list';
import { fetchCards } from '@/api/cards';
import ScreenHeader from '@/components/screen-header';
import { searchStyles } from '@/constants/search-filter-styles';
import { layout, Palette } from '@/constants/theme';

export default function CardsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  return (
    <View style={layout.screen}>
      <ScreenHeader
        title='EXPLORE CARDS'
        subtitle='Find cards to collect and trade.'
      />

      <View style={layout.top}>
        <Searchbar
          placeholder='Search your cards...'
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

        <View style={searchStyles.filterSection}>
          <View style={searchStyles.filterList}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ gap: 10 }}
            >
              {FILTERS.map((filter) => (
                <Pressable
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  style={[
                    searchStyles.filterButton,
                    activeFilter === filter && searchStyles.activeFilterButton,
                  ]}
                >
                  <Text
                    style={[
                      searchStyles.filterText,
                      activeFilter === filter && searchStyles.activeFilterText,
                    ]}
                  >
                    {filter}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

        <CardList
          fetchlist={fetchCards}
          query={searchQuery}
          activeFilter={activeFilter}
          emptyMessage='Unable to load cards'
        />
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
    paddingHorizontal: 20,
    flex: 1,
  },
});
