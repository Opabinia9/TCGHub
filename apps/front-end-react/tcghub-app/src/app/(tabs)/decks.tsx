import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

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

type Tab = 'mine' | 'community';

const MY_DECKS: Deck[] = [
  { id: '1', name: 'Green Stompy', format: 'Modern', cardCount: 60, artColor: '#3F6B3A', colors: ['G'] },
  { id: '2', name: 'Blue Control', format: 'Commander', cardCount: 100, artColor: '#34506E', colors: ['U'] },
  { id: '3', name: 'Boros Aggro', format: 'Standard', cardCount: 60, artColor: '#8A3B2E', colors: ['R', 'W'] },
  { id: '4', name: 'Dimir Midrange', format: 'Pioneer', cardCount: 60, artColor: '#3B3550', colors: ['U', 'B'] },
];

const COMMUNITY_DECKS: Deck[] = [
  { id: '5', name: 'Mono Red Burn', format: 'Modern', cardCount: 60, artColor: '#9A4A22', colors: ['R'] },
  { id: '6', name: 'Selesnya Tokens', format: 'Standard', cardCount: 60, artColor: '#6B7A3A', colors: ['G', 'W'] },
];

const FILTERS = ['GAME', 'FORMAT', 'COLOUR'];

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function Decks() {
  const [tab, setTab] = useState<Tab>('mine');
  const [searchQuery, setSearchQuery] = useState('');

  // Pick the list for the selected tab, then keep only decks whose name
  // contains what's typed in the search bar.
  const allDecks = tab === 'mine' ? MY_DECKS : COMMUNITY_DECKS;
  const query = searchQuery.trim().toLowerCase();
  const decks = allDecks.filter((deck) => deck.name.toLowerCase().includes(query));

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>DECKS</Text>
          <Text style={styles.subtitle}>Discover, build and share decks.</Text>
        </View>

        <Pressable
          onPress={() => console.log('New deck pressed')}
          accessibilityRole="button"
          accessibilityLabel="Create a new deck"
          style={styles.newButton}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.newButtonText}>NEW</Text>
        </Pressable>
      </View>

      {/* My decks / Community toggle */}
      <View style={styles.toggle} accessibilityRole="tablist">
        <ToggleButton label="MY DECKS" active={tab === 'mine'} onPress={() => setTab('mine')} />
        <ToggleButton label="COMMUNITY" active={tab === 'community'} onPress={() => setTab('community')} />
      </View>

      {/* Search */}
      <Searchbar
        placeholder="Search for a deck…"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
        iconColor="#245f28"
        placeholderTextColor="#7A705F"
        elevation={0}
      />

      {/* Filters */}
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
            <Ionicons name="chevron-down" size={16} color="#171717" />
          </Pressable>
        ))}
      </View>

      {/* Deck list */}
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
  );
}

// ─── Pieces ──────────────────────────────────────────────────────────────────

type ToggleButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function ToggleButton({ label, active, onPress }: ToggleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      style={[styles.toggleButton, active && styles.toggleButtonActive]}
    >
      <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{label}</Text>
    </Pressable>
  );
}

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
            <View key={c} style={[styles.pip, { backgroundColor: MANA[c].color }]} />
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
    backgroundColor: '#E2D7BD',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },

  // Header
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

  // Toggle
  toggle: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#D8C9A8',
  },
  toggleButton: {
    flex: 1,
    height: 38,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#171717',
  },
  toggleText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 14,
    letterSpacing: 1.4,
    color: '#3A342B',
  },
  toggleTextActive: {
    color: '#E2D7BD',
  },

  // Search
  searchbar: {
    marginTop: 14,
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

  // Filters
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

  // Deck list
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