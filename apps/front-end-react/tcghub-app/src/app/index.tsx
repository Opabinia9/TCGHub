
import { useState } from 'react';
import { ScrollView, View, StyleSheet, Image } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Chip,
  Searchbar,
  Text,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const featuredCards = [
  {
    id: '1',
    name: 'Sol Ring',
    type: 'Artifact',
    category: 'Spells',
    image: require('../../assets/images/cards/image-1.webp'),
  },
  {
    id: '2',
    name: 'Lightning Bolt',
    type: 'Instant',
    category: 'Spells',
    image: require('../../assets/images/cards/image-2.webp'),
  },
  {
    id: '3',
    name: 'Llanowar Elves',
    type: 'Creature',
    category: 'Creatures',
    image: require('../../assets/images/cards/image-3.webp'),
  },
  {
    id: '4',
    name: 'Serra Angel',
    type: 'Creature',
    category: 'Creatures',
    image: require('../../assets/images/cards/image-4.jpeg'),
  },
];

const filters = ['All', 'Creatures', 'Spells'];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredCards = featuredCards.filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'All' || card.category === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>TCG HUB</Text>
          <Text style={styles.subtitle}>
            Your next trade starts here.
          </Text>
        </View>

        <Avatar.Icon
          size={46}
          icon="account"
          color="#E2D7BD"
          style={styles.profileAvatar}
        />
      </View>

      {/* Welcome */}
      <View style={styles.welcome}>
        <Text variant="headlineMedium" style={styles.heading}>
          Welcome, Planeswalker.
        </Text>

        <Text style={styles.description}>
          Discover cards, build decks and find your next trade.
        </Text>
      </View>

      {/* Search */}
      <Searchbar
        placeholder="Search for players, cards, decks..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
        iconColor="#171717"
        placeholderTextColor="#777064"
        elevation={0}
      />

      {/* Featured cards */}
      <View style={styles.sectionHeader}>
        <View>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Explore cards
          </Text>
          <Text style={styles.sectionSubtitle}>
            Find something for your collection.
          </Text>
        </View>

        <Ionicons
          name="sparkles-outline"
          size={25}
          color="#171717"
        />
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {filters.map((filter) => (
          <Chip
            key={filter}
            selected={activeFilter === filter}
            onPress={() => setActiveFilter(filter)}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.activeFilter,
            ]}
            textStyle={[
              styles.filterText,
              activeFilter === filter && styles.activeFilterText,
            ]}
            showSelectedCheck={false}
          >
            {filter}
          </Chip>
        ))}
      </View>

      {/* Card grid */}
      <View style={styles.cardGrid}>
        {filteredCards.map((card) => (
          <Card key={card.id} style={styles.card} mode="contained">
            <View style={styles.cardArtwork}>
              <Image
                source={card.image}
                style={styles.cardImage}
                resizeMode="contain"
              />
            </View>

            <Card.Content style={styles.cardContent}>
              <Text variant="titleMedium" style={styles.cardName}>
                {card.name}
              </Text>

              <Text style={styles.cardType}>{card.type}</Text>

              <Button
                mode="outlined"
                compact
                textColor="#171717"
                style={styles.cardButton}
                onPress={() => {}}
              >
                View card
              </Button>
            </Card.Content>
          </Card>
        ))}
      </View>

      {filteredCards.length === 0 && (
        <Text style={styles.emptyMessage}>
          No cards found. Try another search.
        </Text>
      )}

      {/* Community activity */}
      <View style={styles.sectionHeader}>
        <View>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Community
          </Text>
          <Text style={styles.sectionSubtitle}>
            Trading is better together.
          </Text>
        </View>
      </View>

      <Card style={styles.activityCard} mode="contained">
        <Card.Content style={styles.activityContent}>
          <Avatar.Icon
            size={46}
            icon="swap-horizontal"
            color="#E2D7BD"
            style={styles.activityAvatar}
          />

          <View style={styles.activityText}>
            <Text variant="titleMedium" style={styles.activityTitle}>
              Ready to trade?
            </Text>

            <Text style={styles.activityDescription}>
              Find players and discover cards they want to exchange.
            </Text>
          </View>
        </Card.Content>

        <Card.Actions>
          <Button
            mode="contained"
            buttonColor="#171717"
            textColor="#E2D7BD"
            onPress={() => {}}
          >
            Explore players
          </Button>
        </Card.Actions>
      </Card>

      <Text style={styles.footer}>
        Built for the love of the game.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2D7BD',
  },

  content: {
    padding: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  logo: {
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#171717',
  },

  subtitle: {
    fontSize: 12,
    color: '#655D50',
    marginTop: 3,
  },

  profileAvatar: {
    backgroundColor: '#171717',
  },

  welcome: {
    marginBottom: 22,
  },

  heading: {
    fontWeight: 'bold',
    color: '#171717',
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: '#655D50',
  },

  searchbar: {
    backgroundColor: '#F4EBDD',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C7B99E',
    marginBottom: 28,
  },

  searchInput: {
    color: '#171717',
    fontSize: 14,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionTitle: {
    fontWeight: 'bold',
    color: '#171717',
  },

  sectionSubtitle: {
    color: '#655D50',
    fontSize: 12,
    marginTop: 4,
  },

  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },

  filterChip: {
    backgroundColor: '#F4EBDD',
    borderColor: '#C7B99E',
    borderWidth: 1,
  },

  activeFilter: {
    backgroundColor: '#171717',
    borderColor: '#171717',
  },

  filterText: {
    color: '#171717',
  },

  activeFilterText: {
    color: '#E2D7BD',
  },

  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    marginBottom: 30,
  },

  card: {
    width: '48%',
    backgroundColor: '#F4EBDD',
    borderRadius: 14,
    overflow: 'hidden',
  },

  cardArtwork: {
    height: 190,
    margin: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 9,
  },

  cardContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },

  cardName: {
    color: '#171717',
    fontWeight: 'bold',
    fontSize: 14,
  },

  cardType: {
    color: '#655D50',
    fontSize: 12,
    marginTop: 3,
  },

  cardButton: {
    marginTop: 10,
    borderColor: '#171717',
    borderRadius: 8,
  },

  emptyMessage: {
    color: '#655D50',
    textAlign: 'center',
    marginBottom: 25,
  },

  activityCard: {
    backgroundColor: '#F4EBDD',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C7B99E',
    marginTop: 2,
  },

  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },

  activityAvatar: {
    backgroundColor: '#171717',
  },

  activityText: {
    flex: 1,
  },

  activityTitle: {
    color: '#171717',
    fontWeight: 'bold',
  },

  activityDescription: {
    color: '#655D50',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  footer: {
    color: '#817663',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 25,
  },
});
