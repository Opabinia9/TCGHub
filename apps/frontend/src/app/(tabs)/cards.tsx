import { act, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { FilterOption, FILTERS } from '@/api/types';
import CardList from '@/components/card-list';
import { fetchCards } from '@/api/cards';
import ScreenHeader from '@/components/screen-header';

export default function CardsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  return (
    <>
      <View style={styles.filterSection}>
        <ScreenHeader title='EXPLORE CARDS' subtitle='Find cards to collect and trade.' />

        <View style={[styles.header, styles.filterList]}>
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
                  styles.filterButton,
                  activeFilter === filter && styles.activeFilterButton,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter && styles.activeFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name='search-outline' size={20} color='#77705F' />

          <TextInput
            placeholder='Search your cards...'
            value={searchQuery}
            onChangeText={setSearchQuery}
            mode='flat'
            underlineColor='transparent'
            activeUnderlineColor='transparent'
            style={styles.searchInput}
            contentStyle={styles.searchInputContent}
            placeholderTextColor='#77705F'
            textColor='#171717'
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name='close-circle' size={20} color='#77705F' />
            </Pressable>
          )}
        </View>
        <CardList
          fetchlist={fetchCards}
          query={searchQuery}
          activeFilter={activeFilter}
          emptyMessage='Unable to load cards'
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E2D7BD',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#77705F',
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#171717',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#5F594D',
    marginTop: 6,
  },
  searchBar: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F4ECDD',
    borderWidth: 1,
    borderColor: '#C9BDA3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: 'transparent',
  },
  searchInputContent: {
    paddingHorizontal: 0,
    fontSize: 14,
  },
  filterSection: {
    backgroundColor: '#E2D7BD',
  },
  filterList: {
    paddingVertical: 8,
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F4ECDD',
    borderWidth: 1,
    borderColor: '#C9BDA3',
  },
  activeFilterButton: {
    backgroundColor: '#171717',
    borderColor: '#171717',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#514B40',
  },
  activeFilterText: {
    color: '#E2D7BD',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 22,
  },
  card: {
    width: '48%',
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: '#F4ECDD',
    borderWidth: 1,
    borderColor: '#C9BDA3',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 0.72,
    backgroundColor: '#D1C4A8',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  expandIcon: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(23, 23, 23, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    paddingHorizontal: 11,
    paddingVertical: 12,
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171717',
  },
  wishlistButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSetName: {
    fontSize: 11,
    color: '#77705F',
    marginTop: 5,
  },
  loadMoreButton: {
    alignSelf: 'center',
    marginTop: 28,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#171717',
  },
  loadMoreText: {
    color: '#E2D7BD',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171717',
  },
  emptyText: {
    fontSize: 13,
    color: '#77705F',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: '#77705F',
    textAlign: 'center',
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  previewBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  previewContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '72%',
  },
  previewSetName: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '600',
    color: '#E2D7BD',
    textAlign: 'center',
  },
  previewClose: {
    position: 'absolute',
    top: 55,
    right: 22,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
