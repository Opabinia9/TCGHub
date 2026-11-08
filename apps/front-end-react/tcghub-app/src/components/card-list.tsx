import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import type { CardListProps, MagicCard, Pagination } from '@/api/types';
import { Pressable, Text, View, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { FlatList } from 'react-native-gesture-handler';
import { Menu, Snackbar } from 'react-native-paper';
import AddToSheet, { type Condition, type SheetType } from '@/components/add-to-sheet';
import { updateCollectionCard } from '@/api/collection';

// Draws an Ionicons icon in our green, for a menu item.
function menuIcon(name: keyof typeof Ionicons.glyphMap) {
  return ({ size }: { size: number }) => (
    <Ionicons name={name} size={size} color='#245f28' />
  );
}

export default function CardList(props: CardListProps) {
  const [cards, setCards] = useState<MagicCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCard, setSelectedCard] = useState<MagicCard | null>(null);

  // Goes up by 1 each time the screen comes into view, which makes the list reload.
  const [refreshCount, setRefreshCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (props.refreshOnFocus) {
        setRefreshCount((count) => count + 1);
      }
    }, [props.refreshOnFocus]),
  );

  // Which card's + menu is open (null = none).
  const [menuCardId, setMenuCardId] = useState<string | null>(null);
  // The listing / collection panel that's open (null = none).
  const [sheet, setSheet] = useState<{ type: SheetType; card: MagicCard } | null>(null);
  // The message in the bar at the bottom (null = hidden).
  const [message, setMessage] = useState<string | null>(null);

  const closeMenu = () => setMenuCardId(null);

  function openSheet(type: SheetType, card: MagicCard) {
    closeMenu();
    setSheet({ type, card });
  }

  async function addToWishlist(card: MagicCard) {
    closeMenu();
    try {
      await updateCollectionCard({
        card_id: card.id,
        quantity: 0,
        for_trade: false,
        wishlist: true,
      });
      setMessage(`${card.name} added to your wishlist`);
    } catch {
      setMessage('Could not update your wishlist. Please try again.');
    }
  }

  async function handleConfirm(quantity: number, condition: Condition) {
    if (!sheet) return;
    const { type, card } = sheet;
    setSheet(null);
    try {
      await updateCollectionCard({
        card_id: card.id,
        quantity,
        condition: type === 'listing' ? condition : undefined,
        for_trade: type === 'listing',
        wishlist: false,
      });
      setMessage(
        type === 'listing'
          ? `${card.name} listed for trade`
          : `${card.name} added to your collection`,
      );
    } catch {
      setMessage('Could not save. Please try again.');
    }
  }

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
    }, [props.query.trim(), props.fetchlist, refreshCount]);
  async function loadMore() {
    if (loading || !pagination || loadingMore) return;
    if (pagination.page >= pagination.totalPages) return;

    try {
      setLoadingMore(true);

      const result = await props.fetchlist(
        props.query.trim(),
        pagination.page + 1,
      );

      setCards((previousCards) => [...previousCards, ...result.items]);

      setPagination(result.pagination);
    } catch {
    } finally {
      setLoadingMore(false);
    }
  }
  const filteredCards = cards.filter(
    (card) =>
      props.activeFilter === 'All' || card.category === props.activeFilter,
  );
  const renderItem = ({ item: card }: { item: MagicCard }) => (
    <View key={card.id} style={styles.card}>
      <Pressable
        onPress={() => setSelectedCard(card)}
        accessibilityRole='button'
        accessibilityLabel={`View ${card.name}`}
        style={styles.imageContainer}
      >
        <Image
          source={{
            uri: card.imageUris?.grid ?? card.imageUris?.normal ?? undefined,
          }}
          style={styles.cardImage}
          contentFit='cover'
        />

        <View style={styles.expandIcon}>
          <Ionicons name='expand-outline' size={18} color='#FFFFFF' />
        </View>
      </Pressable>

      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={2}>
          {card.name}
        </Text>
        <Text style={styles.cardSetName} numberOfLines={2}>
          {card.setName || 'Set information unavailable'}
        </Text>

        {/* Price on the left, + on the right */}
        <View style={styles.cardPriceRow}>
          <View>
            <Text style={styles.cardPriceLabel}>PRICE</Text>
            <Text style={styles.cardPrice}>
              {card.prices.usd ? `$${card.prices.usd}` : '—'}
            </Text>
          </View>

          <Menu
            visible={menuCardId === card.id}
            onDismiss={closeMenu}
            anchorPosition='bottom'
            contentStyle={styles.menu}
            anchor={
              <Pressable
                onPress={() => setMenuCardId(card.id)}
                accessibilityRole='button'
                accessibilityLabel={`Add ${card.name} to…`}
                hitSlop={4}
                style={[
                  styles.addButton,
                  menuCardId === card.id && styles.addButtonActive,
                ]}
              >
                <Ionicons
                  name='add'
                  size={22}
                  color={menuCardId === card.id ? '#E2D7BD' : '#171717'}
                />
              </Pressable>
            }
          >
            <Menu.Item
              leadingIcon={menuIcon('heart-outline')}
              title='Add to wishlist'
              titleStyle={styles.menuItemText}
              onPress={() => addToWishlist(card)}
            />
            <Menu.Item
              leadingIcon={menuIcon('pricetag-outline')}
              title='Add to my listings'
              titleStyle={styles.menuItemText}
              onPress={() => openSheet('listing', card)}
            />
            <Menu.Item
              leadingIcon={menuIcon('albums-outline')}
              title='Add to collection'
              titleStyle={styles.menuItemText}
              onPress={() => openSheet('collection', card)}
            />
            <View style={styles.menuDivider} />
            <Menu.Item
              leadingIcon={menuIcon('layers-outline')}
              title='Add to deck'
              titleStyle={styles.menuItemText}
              onPress={closeMenu}
            />
          </Menu>
        </View>
      </View>
    </View>
  );
  return (
    <View style={{ height: '90%' }}>
      <FlatList
        data={filteredCards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={menuCardId}
        numColumns={2}
        columnWrapperStyle={styles.cardNameRow}
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />

      {error && !loading && (
        <View style={styles.emptyState}>
          <Ionicons name='alert-circle-outline' size={36} color='#77705F' />
          <Text style={styles.emptyTitle}>Something went wrong</Text>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      )}

      {!loading && !error && filteredCards.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name='search-outline' size={36} color='#77705F' />
          <Text style={styles.emptyTitle}>No cards found</Text>
          <Text style={styles.emptyText}>Try another search or category.</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          TCG HUB · YOUR NEXT TRADE STARTS HERE
        </Text>
      </View>
      <Modal
        visible={selectedCard !== null}
        transparent
        animationType='fade'
        statusBarTranslucent
        onRequestClose={() => setSelectedCard(null)}
      >
        <View style={styles.previewOverlay}>
          <Pressable
            style={styles.previewBackdrop}
            onPress={() => setSelectedCard(null)}
          />

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
                contentFit='contain'
              />

              <Text style={styles.previewSetName}>
                {selectedCard.setName || 'Set information unavailable'}
              </Text>
            </View>
          )}

          <Pressable
            style={styles.previewClose}
            onPress={() => setSelectedCard(null)}
            accessibilityRole='button'
            accessibilityLabel='Close preview'
          >
            <Ionicons name='close' size={30} color='#FFFFFF' />
          </Pressable>
        </View>
      </Modal>

      {sheet && (
        <AddToSheet
          type={sheet.type}
          card={sheet.card}
          onClose={() => setSheet(null)}
          onConfirm={handleConfirm}
        />
      )}

      <Snackbar
        visible={message !== null}
        onDismiss={() => setMessage(null)}
        duration={2500}
      >
        {message ?? ''}
      </Snackbar>
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
    flex: 1,
    paddingHorizontal: 11,
    paddingVertical: 12,
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 6,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171717',
  },
  cardSetName: {
    fontSize: 11,
    color: '#77705F',
    marginTop: 5,
    marginBottom: 10,
  },
  cardPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 'auto',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#DCCFB3',
  },
  cardPriceLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#77705F',
  },
  cardPrice: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 19,
    color: '#171717',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E2D7BD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonActive: {
    backgroundColor: '#171717',
  },
  menu: {
    backgroundColor: '#FBF7EE',
    borderRadius: 14,
  },
  menuItemText: {
    fontSize: 15,
    color: '#171717',
  },
  menuDivider: {
    height: 1,
    marginHorizontal: 12,
    marginVertical: 4,
    backgroundColor: '#DCCFB3',
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
