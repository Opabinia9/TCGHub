import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// ─── Data ────────────────────────────────────────────────────────────────────
// Placeholder listings until the backend has a listings endpoint.

type ListingType = 'TRADE' | 'SELL' | 'TRADE / SELL';

type Listing = {
  id: string;
  cardName: string;
  artColor: string;
  type: ListingType;
  condition: string;
  seller: string;
};

const LISTINGS: Listing[] = [
  { id: '1', cardName: 'The One Ring', artColor: '#6E5A2E', type: 'TRADE', condition: 'Near mint', seller: 'Jordan' },
  { id: '2', cardName: 'Orcish Bowmasters', artColor: '#3B3550', type: 'SELL', condition: 'Lightly played', seller: 'Priya' },
  { id: '3', cardName: 'Ragavan, Nimble Pilferer', artColor: '#8A3B2E', type: 'TRADE / SELL', condition: 'Near mint', seller: 'Alex' },
  { id: '4', cardName: 'Sheoldred, the Apocalypse', artColor: '#2E2B33', type: 'SELL', condition: 'Near mint', seller: 'Marcus' },
  { id: '5', cardName: 'Llanowar Elves', artColor: '#3F6B3A', type: 'TRADE', condition: 'Played', seller: 'Sam' },
  { id: '6', cardName: 'Counterspell', artColor: '#34506E', type: 'TRADE / SELL', condition: 'Lightly played', seller: 'Jess' },
  { id: '7', cardName: 'Sol Ring', artColor: '#5E5A55', type: 'TRADE', condition: 'Near mint', seller: 'Chris' },
  { id: '8', cardName: 'Lightning Bolt', artColor: '#9A4A22', type: 'SELL', condition: 'Played', seller: 'Mia' },
];

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function TradeScreen() {
  const listings = LISTINGS;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            LISTED CARDS
          </Text>

          <Pressable
            onPress={() => console.log('List a card pressed')}
            accessibilityRole="button"
            accessibilityLabel="List a card"
            style={styles.listButton}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.listButtonText}>LIST A CARD</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>Buy, sell and trade with players near you.</Text>

        {/* Listings */}
        <View style={styles.grid}>
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </View>

        {listings.length === 0 && (
          <Text style={styles.emptyMessage}>No cards listed right now.</Text>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Pieces ──────────────────────────────────────────────────────────────────

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <View style={styles.card}>
      {/* Card picture (placeholder colour until real card images are used) */}
      <View style={styles.cardFrame}>
        <View style={[styles.cardArt, { backgroundColor: listing.artColor }]}>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>{listing.type}</Text>
          </View>
          <Text style={styles.cardArtName} numberOfLines={2}>
            {listing.cardName}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>
          {listing.cardName}
        </Text>
        <Text style={styles.cardCondition}>{listing.condition}</Text>
        <View style={styles.sellerRow}>
          <Ionicons name="person-outline" size={13} color="#3A342B" />
          <Text style={styles.sellerText}>{listing.seller}</Text>
        </View>
      </View>

      <Pressable
        onPress={() => console.log('Message', listing.seller, 'about', listing.cardName)}
        accessibilityRole="button"
        accessibilityLabel={`Message ${listing.seller} about ${listing.cardName}`}
        style={styles.messageButton}
      >
        <Ionicons name="chatbubble-outline" size={17} color="#171717" />
        <Text style={styles.messageButtonText}>MESSAGE</Text>
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
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    flex: 1,
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 40,
    lineHeight: 44,
    color: '#171717',
  },
  subtitle: {
    fontSize: 14,
    color: '#5A5246',
    marginTop: 2,
  },
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 44,
    paddingLeft: 10,
    paddingRight: 14,
    borderRadius: 12,
    backgroundColor: '#2e7d32',
  },
  listButtonText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 15,
    letterSpacing: 1.2,
    color: '#FFFFFF',
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
    marginTop: 16,
  },
  card: {
    width: '48%',
    gap: 8,
  },
  cardFrame: {
    aspectRatio: 63 / 80,
    padding: 5,
    borderRadius: 12,
    backgroundColor: '#171717',
  },
  cardArt: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
    borderRadius: 8,
  },
  typeTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#E2D7BD',
  },
  typeTagText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 12,
    letterSpacing: 1,
    color: '#171717',
  },
  cardArtName: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 15,
    color: '#F4EEDF',
  },
  cardInfo: {
    paddingHorizontal: 2,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
  },
  cardCondition: {
    fontSize: 13,
    color: '#5A5246',
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sellerText: {
    fontSize: 13,
    color: '#3A342B',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#171717',
  },
  messageButtonText: {
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
