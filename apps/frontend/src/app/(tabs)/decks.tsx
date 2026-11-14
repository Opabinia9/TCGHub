
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import CardList from '@/components/card-list';
import ScreenHeader from '@/components/screen-header';
import { fetchCollection } from '@/api/collection';
import { fetchDecks, type Deck } from '@/api/decks';
import { Palette, layout } from '@/constants/theme';
import { searchStyles } from '@/constants/search-filter-styles';
import { buttonStyles, ToggleButton } from '@/components/toggle-button';

type Tab = 'mine' | 'collection';

const FILTERS = ['GAME', 'FORMAT', 'COLOUR'];

// Screen

export default function Decks() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<Tab>('mine');
  const [searchQuery, setSearchQuery] = useState('');
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loadingDecks, setLoadingDecks] = useState(true);
  const [deckError, setDeckError] = useState(false);

  useEffect(() => {
    if (params.tab === 'collection') {
      setTab('collection');
      router.setParams({ tab: undefined });
    }
  }, [params.tab]);

  useEffect(() => {
    async function loadDecks() {
      try {
        setLoadingDecks(true);
        setDeckError(false);

        const data = await fetchDecks();
        setDecks(data);
      } catch (error) {
        console.error('Failed to load decks:', error);
        setDeckError(true);
      } finally {
        setLoadingDecks(false);
      }
    }

    if (tab === 'mine') {
      loadDecks();
    }
  }, [tab]);

  const isCollection = tab === 'collection';
  const query = searchQuery.trim().toLowerCase();

  const filteredDecks = decks.filter((deck) =>
    deck.deck_name.toLowerCase().includes(query),
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

      <View style={[layout.top, { flex: 1 }]}>
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
            {loadingDecks ? (
              <Text style={styles.emptyMessage}>Loading decks...</Text>
            ) : deckError ? (
              <Text style={styles.emptyMessage}>
                Unable to load your decks.
              </Text>
            ) : (
              <>
                <View style={styles.deckList}>
                  {filteredDecks.map((deck) => (
                    <DeckRow key={deck.id} deck={deck} />
                  ))}
                </View>

                {filteredDecks.length === 0 && (
                  <Text style={styles.emptyMessage}>
                    {query
                      ? `No decks match "${searchQuery}".`
                      : 'No decks yet.'}
                  </Text>
                )}
              </>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

// Deck row

function DeckRow({ deck }: { deck: Deck }) {
  return (
    <View style={styles.deckRow}>
      <View
        style={[
          styles.deckArt,
          { backgroundColor: Palette.greenAccent },
        ]}
      />

      <View style={styles.deckInfo}>
        <Text style={styles.deckName} numberOfLines={1}>
          {deck.deck_name}
        </Text>
        <Text style={styles.deckMeta}>YOUR DECK</Text>
      </View>

      <Pressable
        onPress={() => console.log('View deck', deck.id)}
        accessibilityRole="button"
        accessibilityLabel={`View ${deck.deck_name} deck`}
        style={styles.viewButton}
      >
        <Text style={styles.viewButtonText}>VIEW</Text>
      </Pressable>
    </View>
  );
}

// Styles

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
