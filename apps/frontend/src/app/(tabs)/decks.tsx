import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import CardList from '@/components/card-list';
import ScreenHeader from '@/components/screen-header';
import { fetchCollection } from '@/api/collection';
import { layout } from '@/constants/theme';
import { searchStyles } from '@/constants/search-filter-styles';
import { buttonStyles, ToggleButton } from '@/components/toggle-button';
import { createDeck, fetchDecks } from '@/api/decks';
import { Deck, Pagination } from '@/api/types';

const MANA = {
  G: { color: '#2e7d32', name: 'green' },
  U: { color: '#2F6DB5', name: 'blue' },
  R: { color: '#C0392B', name: 'red' },
  W: { color: '#F2EBD8', name: 'white' },
  B: { color: '#2B2B2B', name: 'black' },
};

type Tab = 'mine' | 'collection';

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function Decks() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<Tab>('mine');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    if (params.tab === 'collection') {
      setTab('collection');
      router.setParams({ tab: undefined });
    }
  }, [params.tab]);

  const isCollection = tab === 'collection';
  const query = searchQuery.trim().toLowerCase();

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const result = await Promise.race([
          fetchDecks(),
          new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => {
              reject(new Error('Request timeout'));
            }, 5000);
          }),
        ]);

        if (!cancelled) {
          setDecks(result.filter((deck: Deck) => deck.name.toLowerCase().includes(query)));
        }
      } catch {
        if (!cancelled) {
          setDecks([]);
          setError('Unable to load cards. Please try again later.');
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [searchQuery]);

  return (
    <View style={layout.screen}>
      <ScreenHeader
        title="DECKS"
        subtitle="Discover, build and share decks."
        right={
          !isCollection && (
            <Pressable
              onPress={() => createDeck(query)}
              accessibilityRole="button"
              accessibilityLabel="Create a new deck"
              style={styles.newButton}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.newButtonText}>NEW</Text>
            </Pressable>
          )
        }
      />

      {/* Top part: toggle, search, filters (doesn't scroll) */}
      <View style={layout.top}>
        <View style={{ paddingVertical: 5 }}>
          {/* My decks / My collection toggle */}
          <View style={buttonStyles.toggle} accessibilityRole="tablist">
            <ToggleButton label="MY DECKS" active={tab === 'mine'} onPress={() => setTab('mine')} />
            <ToggleButton
              label="MY COLLECTION"
              active={isCollection}
              onPress={() => setTab('collection')}
            />
          </View>

          <Searchbar
            placeholder={isCollection ? 'Search your collection…' : 'Search for a deck…'}
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

        {/* <View style={styles.filterRow}> */}
        {/*   {FILTERS.map((label) => ( */}
        {/*     <Pressable */}
        {/*       key={label} */}
        {/*       onPress={() => console.log(label + ' filter pressed')} */}
        {/*       hitSlop={4} */}
        {/*       accessibilityRole="button" */}
        {/*       accessibilityLabel={`Filter by ${label.toLowerCase()}`} */}
        {/*       style={styles.filterChip} */}
        {/*     > */}
        {/*       <Text style={styles.filterText}>{label}</Text> */}
        {/*       <Ionicons name="chevron-down" size={16} color="#171717" /> */}
        {/*     </Pressable> */}
        {/*   ))} */}
        {/* </View> */}
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
                {query ? `No decks match "${searchQuery}".` : 'No decks yet.'}
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
  // const colourNames = deck.colors.map((c) => MANA[c].name).join(' and ');
  console.log(deck);

  return (
    <View style={styles.deckRow}>
      <View style={styles.deckInfo}>
        <Text style={styles.deckName} numberOfLines={1}>
          {deck.name}
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
    color: '#171717',
  },
  subtitle: {
    fontSize: 14,
    color: '#5A5246',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#2e7d32',
  },
  newButtonText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 15,
    letterSpacing: 1.5,
    color: '#FFFFFF',
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
    borderWidth: 1.5,
    borderColor: '#171717',
  },
  filterText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 14,
    letterSpacing: 1.1,
    color: '#171717',
  },
  deckList: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#C9BB98',
  },
  deckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#C9BB98',
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
    borderColor: '#F4EEDF',
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
    color: '#171717',
  },
  deckMeta: {
    fontSize: 13,
    color: '#5A5246',
    marginTop: 2,
  },
  viewButton: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 14,
    letterSpacing: 1.4,
    color: '#171717',
  },
  emptyMessage: {
    marginTop: 24,
    textAlign: 'center',
    color: '#5A5246',
  },
});
