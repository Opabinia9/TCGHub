import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { Modal, Pressable, ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { fetchCards, type MagicCard, type Pagination } from '@/api/cards';
import { useWishlist } from '@/context/WishlistContext';

const FILTERS = ['All', 'Creature', 'Sorcery', 'Enchantment', 'Instant', 'Artifact', 'Land'];

type FilterOption = (typeof FILTERS)[number];

export default function CardsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<MagicCard | null>(null);
  const [cards, setCards] = useState<MagicCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const { wishlistCards, toggleWishlist } = useWishlist();

  // Load cards from the API, or use temporary cards if it fails.
  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const result = await Promise.race([
          fetchCards(searchQuery.trim()),
          new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => {
              reject(new Error('Request timeout'));
            }, 5000);
          }),
        ]);

        if (!cancelled) {
          setCards(result.items);
          setPagination(result.pagination);
        }
      } catch {
        if (!cancelled) {
          setCards([]);
          setPagination(null);
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

  // Load the next page of cards.
  async function loadMore() {
    if (loading || !pagination || loadingMore) return;
    if (pagination.page >= pagination.totalPages) return;

    try {
      setLoadingMore(true);

      const result = await fetchCards(searchQuery.trim(), pagination.page + 1);

      setCards((previousCards) => [...previousCards, ...result.items]);

      setPagination(result.pagination);
    } catch {
      // More cards could not be loaded.
    } finally {
      setLoadingMore(false);
    }
  }

  const filteredCards = cards.filter(
    (card) => activeFilter === 'All' || card.category === activeFilter,
  );

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
          <Text style={styles.subtitle}>Discover cards for your next trade.</Text>
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
          />

          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
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
                style={[styles.filterButton, activeFilter === filter && styles.activeFilterButton]}
              >
                <Text
                  style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}
                >
                  {filter}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.cardsGrid}>
          {filteredCards.map((card) => {
            const isInWishlist = wishlistCards.some((item) => item.id === card.id);

            return (
              <View key={card.id} style={styles.card}>
                <Pressable
                  onPress={() => setSelectedCard(card)}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${card.name}`}
                  style={styles.imageContainer}
                >
                  <Image
                    source={{
                      uri: card.imageUris?.grid ?? card.imageUris?.normal ?? undefined,
                    }}
                    style={styles.cardImage}
                    contentFit="cover"
                  />

                  <View style={styles.expandIcon}>
                    <Ionicons name="expand-outline" size={18} color="#FFFFFF" />
                  </View>
                </Pressable>

                <View style={styles.cardInfo}>
                  <View style={styles.cardNameRow}>
                    <Text style={styles.cardName} numberOfLines={2}>
                      {card.name}
                    </Text>

                    <Pressable
                      style={styles.wishlistButton}
                      onPress={() => toggleWishlist(card)}
                      accessibilityRole="button"
                      accessibilityLabel={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      hitSlop={8}
                    >
                      <Ionicons
                        name={isInWishlist ? 'heart' : 'heart-outline'}
                        size={24}
                        color="#171717"
                      />
                    </Pressable>
                  </View>

                  <Text style={styles.cardSetName} numberOfLines={2}>
                    {card.setName || 'Set information unavailable'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {pagination && pagination.page < pagination.totalPages && !loading && !loadingMore && (
          <Pressable style={styles.loadMoreButton} onPress={loadMore}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </Pressable>
        )}

        {loadingMore && <ActivityIndicator style={{ marginVertical: 32 }} color="#171717" />}

        {loading && <ActivityIndicator style={{ marginVertical: 32 }} color="#171717" />}

        {error && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={36} color="#77705F" />
            <Text style={styles.emptyTitle}>Something went wrong</Text>
            <Text style={styles.emptyText}>{error}</Text>
          </View>
        )}

        {!loading && !error && filteredCards.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={36} color="#77705F" />
            <Text style={styles.emptyTitle}>No cards found</Text>
            <Text style={styles.emptyText}>Try another search or category.</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>TCG HUB · YOUR NEXT TRADE STARTS HERE</Text>
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
          <Pressable style={styles.previewBackdrop} onPress={() => setSelectedCard(null)} />

          {selectedCard && (
            <View style={styles.previewContent}>
              <Image
                source={{
                  uri:
                    selectedCard.imageUris?.large ??
                    selectedCard.imageUris?.normal ??
                    selectedCard.imageUris?.grid ??
                    undefined,
                }}
                style={styles.previewImage}
                contentFit="contain"
              />

              <Text style={styles.previewSetName}>
                {selectedCard.setName || 'Set information unavailable'}
              </Text>
            </View>
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
    flex: 1,
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
