
import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

type CardCategory = 'Creatures' | 'Spells' | 'Artifacts';

type MagicCard = {
  id: string;
  name: string;
  type: string;
  category: CardCategory;
  image: number;
};

const CARDS: MagicCard[] = [
  {
    id: '1',
    name: 'Sol Ring',
    type: 'Artifact',
    category: 'Artifacts',
    image: require('../../../assets/images/cards/image-1.webp'),
  },
  {
    id: '2',
    name: 'Lightning Bolt',
    type: 'Instant',
    category: 'Spells',
    image: require('../../../assets/images/cards/image-2.webp'),
  },
  {
    id: '3',
    name: 'Llanowar Elves',
    type: 'Creature',
    category: 'Creatures',
    image: require('../../../assets/images/cards/image-3.webp'),
  },
  {
    id: '4',
    name: 'Serra Angel',
    type: 'Creature',
    category: 'Creatures',
    image: require('../../../assets/images/cards/image-4.jpeg'),
  },
];

const FILTERS = ['All', 'Creatures', 'Spells', 'Artifacts'] as const;

type FilterOption = (typeof FILTERS)[number];

export default function CardsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<MagicCard | null>(null);

  const filteredCards = CARDS.filter((card) => {
    const matchesFilter =
      activeFilter === 'All' || card.category === activeFilter;

    const matchesSearch = card.name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>YOUR MAGIC COLLECTION</Text>
          <Text style={styles.title}>EXPLORE CARDS</Text>
          <Text style={styles.subtitle}>
            Discover cards for your next trade.
          </Text>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#77705F" />

          <TextInput
            placeholder="Search your cards..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            mode="flat"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            style={styles.searchInput}
            contentStyle={styles.searchInputContent}
            placeholderTextColor="#77705F"
            textColor="#171717"
            accessibilityLabel="Search cards by name"
          />

          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={20} color="#77705F" />
            </Pressable>
          )}
        </View>

        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
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

        <View style={styles.cardsGrid}>
          {filteredCards.map((card) => (
            <View key={card.id} style={styles.card}>
              <Pressable
                onPress={() => setSelectedCard(card)}
                accessibilityRole="button"
                accessibilityLabel={`Enlarge ${card.name}`}
                style={styles.imageContainer}
              >
                <Image
                  source={card.image}
                  style={styles.cardImage}
                  resizeMode="cover"
                />

                <View style={styles.cardTypeBadge}>
                  <Text style={styles.cardTypeText}>{card.type}</Text>
                </View>

                <View style={styles.expandIcon}>
                  <Ionicons
                    name="expand-outline"
                    size={18}
                    color="#FFFFFF"
                  />
                </View>
              </Pressable>

              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{card.name}</Text>
                <Text style={styles.cardCategory}>{card.category}</Text>
              </View>
            </View>
          ))}
        </View>

        {filteredCards.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={36}
              color="#77705F"
            />
            <Text style={styles.emptyTitle}>No cards found</Text>
            <Text style={styles.emptyText}>
              Try another search or category.
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            TCG HUB · YOUR NEXT TRADE STARTS HERE
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={selectedCard !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setSelectedCard(null)}
      >
        <View style={styles.previewOverlay}>
          <Pressable
            style={styles.previewBackdrop}
            onPress={() => setSelectedCard(null)}
            accessibilityRole="button"
            accessibilityLabel="Close enlarged card"
          />

          {selectedCard && (
            <Image
              source={selectedCard.image}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}

          <Pressable
            style={styles.previewClose}
            onPress={() => setSelectedCard(null)}
            accessibilityRole="button"
            accessibilityLabel="Close preview"
          >
            <Ionicons name="close" size={30} color="#FFFFFF" />
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2D7BD',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 22,
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
    marginBottom: 20,
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
    marginBottom: 22,
  },
  filterList: {
    gap: 10,
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
  cardTypeBadge: {
    position: 'absolute',
    top: 10,
    left: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: 'rgba(23, 23, 23, 0.88)',
  },
  cardTypeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
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
  cardName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171717',
  },
  cardCategory: {
    fontSize: 12,
    color: '#77705F',
    marginTop: 4,
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
  previewImage: {
    width: '100%',
    height: '85%',
  },
  previewClose: {
    position: 'absolute',
    top: 48,
    right: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
