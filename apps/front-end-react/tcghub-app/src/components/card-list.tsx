import { useState, useEffect } from 'react';
import type { CardListProps, MagicCard, Pagination } from '@/api/types';
import { Pressable, Text, View, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { FlatList } from 'react-native-gesture-handler';

export default function CardList(props: CardListProps) {
  // Load cards from the API, or use temporary cards if it fails.
  const [cards, setCards] = useState<MagicCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCard, setSelectedCard] = useState<MagicCard | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const result = await Promise.race([
          props.fetchlist(props.query.trim()),
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
  }, [props.query.trim()]);
  // Load the next page of cards.
  async function loadMore() {
    if (loading || !pagination || loadingMore) return;
    if (pagination.page >= pagination.totalPages) return;

    try {
      setLoadingMore(true);

      const result = await props.fetchlist(props.query.trim(), pagination.page + 1);

      setCards((previousCards) => [...previousCards, ...result.items]);

      setPagination(result.pagination);
    } catch {
      // More cards could not be loaded.
    } finally {
      setLoadingMore(false);
    }
  }
  const filteredCards = cards.filter(
    (card) => props.activeFilter === 'All' || card.category === props.activeFilter,
  );
  const renderItem = ({ item: card }: { item: MagicCard }) => (
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
        <Text style={styles.cardSetName} numberOfLines={2}>
          {card.prices.usd ? `$${card.prices.usd}` : 'Price unavailable'}
        </Text>
      </View>
    </View>
  );
  return (
    <View style={{ height: '90%' }}>
      <FlatList
        data={filteredCards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.cardNameRow}
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E2D7BD',
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 400,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 22,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 0.72,
    backgroundColor: '#D1C4A8',
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
  cardImage: {
    width: '100%',
    height: '100%',
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
  cardSetName: {
    fontSize: 11,
    color: '#77705F',
    marginTop: 5,
  },
  wishlistButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '48%',
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: '#F4ECDD',
    borderWidth: 1,
    borderColor: '#C9BDA3',
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
    width: '90%',
    height: '72%',
    borderRadius: 35,
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
