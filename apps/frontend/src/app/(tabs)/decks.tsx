
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import CardList from '@/components/card-list';
import ScreenHeader from '@/components/screen-header';
import { fetchCollection } from '@/api/collection';
import { Palette, layout } from '@/constants/theme';
import { searchStyles } from '@/constants/search-filter-styles';
import { buttonStyles, ToggleButton } from '@/components/toggle-button';

const MANA = {
  G: { color: '#2e7d32', name: 'green' },
  U: { color: '#2F6DB5', name: 'blue' },
  R: { color: '#C0392B', name: 'red' },
  W: { color: '#F2EBD8', name: 'white' },
  B: { color: '#2B2B2B', name: 'black' },
};

type ManaColor = keyof typeof MANA;

type Deck = {
  id: string;
  name: string;
  format: string;
  cardCount: number;
  artColor: string;
  colors: ManaColor[];
};

type Tab = 'mine' | 'collection';

const MY_DECKS: Deck[] = [
  {
    id: '1',
    name: 'Green Stompy',
    format: 'Modern',
    cardCount: 60,
    artColor: '#3F6B3A',
    colors: ['G'],
  },
  {
    id: '2',
    name: 'Blue Control',
    format: 'Commander',
    cardCount: 100,
    artColor: '#34506E',
    colors: ['U'],
  },
  {
    id: '3',
    name: 'Boros Aggro',
    format: 'Standard',
    cardCount: 60,
    artColor: '#8A3B2E',
    colors: ['R', 'W'],
  },
  {
    id: '4',
    name: 'Dimir Midrange',
    format: 'Pioneer',
    cardCount: 60,
    artColor: '#3B3550',
    colors: ['U', 'B'],
  },
];

const FILTERS = ['GAME', 'FORMAT', 'COLOUR'];

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function Decks() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<Tab>('mine');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (params.tab === 'collection') {
      setTab('collection');
      router.setParams({ tab: undefined });
    }
  }, [params.tab]);

  const isCollection = tab === 'collection';
  const query = searchQuery.trim().toLowerCase();
  const decks = MY_DECKS.filter((deck) =>
    deck.name.toLowerCase().includes(query),
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="DECKS"
        subtitle="Discover, build and share decks."
        right={
          !isCollection && (
            <Pressable
              onPress={() => console.log('New deck pressed')}
              accessibilityRole="button"
              accessibilityLabel="Create a new deck"
              style={styles.newButton}
            >
              <Ionicons name="add" size={18} color={Palette.white} />
              <Text style={styles.newButtonText}>NEW</Text>
            </Pressable>
          )
        }
      />

      {/* Top part: toggle, search, filters (doesn't scroll) */}
      <View style={[layout.top, { flex: 1 }]}>
        {/* My decks / My collection toggle */}
        <View style={buttonStyles.toggle} accessibilityRole="tablist">
          <ToggleButton
            label="MY DECKS"
            active={tab === 'mine'}
            onPress={() => setTab('mine')}
          />
          <ToggleButton
            label="MY COLLECTION"
            active={isCollection}
            onPress={() => setTab('collection')}
          />
        </View>

        <Searchbar
          placeholder={
            isCollection ? 'Search your collection…' : 'Search for a deck…'
          }
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

        <View style={styles.filterRow}>
          {FILTERS.map((label) => (
            <Pressable
              key={label}
              onPress={() => console.log(label + ' filter pressed')}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${label.toLowerCase()}`}
              style={styles.filterChip}
            >
              <Text style={styles.filterText}>{label}</Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color={Palette.gold}
              />
            </Pressable>
          ))}
        </View>

        {/* Bottom part: scrolls by itself */}
        {isCollection ? (
          <CardList
            fetchlist={fetchCollection}
            query={searchQuery}
            activeFilter="all"
            emptyMessage="Unable to load your collection"
            refreshOnFocus
          />
        ) : (
          <ScrollView
            style={styles.listArea}
            contentContainerStyle={styles.deckScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.deckList}>
              {decks.map((deck) => (
                <DeckRow key={deck.id} deck={deck} />
              ))}
            </View>

            {decks.length === 0 && (
              <Text style={styles.emptyMessage}>
                {query
                  ? `No decks match "${searchQuery}".`
                  : 'No decks yet.'}
              </Text>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

// ─── Pieces ──────────────────────────────────────────────────────────────────

function DeckRow({ deck }: { deck: Deck }) {
  const colourNames = deck.colors.map((c) => MANA[c].name).join(' and ');

  return (
    <View style={styles.deckRow}>
      <View style={[styles.deckArt, { backgroundColor: deck.artColor }]}>
        <View
          style={styles.pipRow}
          accessible
          accessibilityLabel={`Colours: ${colourNames}`}
        >
          {deck.colors.map((c) => (
            <View
              key={c}
              style={[styles.pip, { backgroundColor: MANA[c].color }]}
            />
          ))}
        </View>
      </View>

      <View style={styles.deckInfo}>
        <Text style={styles.deckName} numberOfLines={1}>
          {deck.name}
        </Text>
        <Text style={styles.deckMeta}>
          {deck.format} · {deck.cardCount} cards
        </Text>
      </View>

      <Pressable
        onPress={() => console.log('View deck', deck.name)}
        accessibilityRole="button"
        accessibilityLabel={`View ${deck.name} deck`}
        style={styles.viewButton}
      >
        <Text style={styles.viewButtonText}>VIEW</Text>
      </Pressable>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  listArea: {
    flex: 1,
  },
  deckScroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 48,
    lineHeight: 50,
    color: Palette.text,
  },
  subtitle: {
    fontSize: 14,
    color: Palette.textSecondary,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: Palette.greenAccent,
    borderWidth: 1,
    borderColor: Palette.gold,
  },
  newButtonText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 15,
    letterSpacing: 1.5,
    color: Palette.white,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 36,
    paddingLeft: 14,
    paddingRight: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  filterText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 14,
    letterSpacing: 1.1,
    color: Palette.text,
  },
  deckList: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  deckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  deckArt: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  cardThumb: {
    width: 40,
    height: 56,
    borderRadius: 6,
  },
  pipRow: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    flexDirection: 'row',
    gap: 3,
  },
  pip: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Palette.text,
  },
  deckInfo: {
    flex: 1,
    minWidth: 0,
  },
  deckName: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 18,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: Palette.text,
  },
  deckMeta: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  viewButton: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Palette.gold,
    backgroundColor: Palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 14,
    letterSpacing: 1.4,
    color: Palette.gold,
  },
  emptyMessage: {
    marginTop: 24,
    textAlign: 'center',
    color: Palette.textSecondary,
  },
});
