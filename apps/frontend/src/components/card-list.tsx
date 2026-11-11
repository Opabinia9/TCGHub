import { useState, useRef, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  FILTERS,
  type CardListProps,
  type CollectionCard,
  type MagicCard,
  type Pagination,
} from '@/api/types';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { FlatList } from 'react-native-gesture-handler';
import { Menu, Portal, Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddToSheet, {
  type Condition,
  type SheetType,
} from '@/components/add-to-sheet';
import {
  fetchOwnedQuantities,
  fetchWishlistIds,
  updateCollectionCard,
} from '@/api/collection';

// Draws an Ionicons icon in our green, for a menu item.
function menuIcon(name: keyof typeof Ionicons.glyphMap) {
  return ({ size }: { size: number }) => (
    <Ionicons name={name} size={size} color='#245f28' />
  );
}

function conditionLabel(condition: string) {
  return condition && condition !== 'unmarked'
    ? condition
    : 'Condition not set';
}
export default function CardList(props: CardListProps) {
  const [cards, setCards] = useState<MagicCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);
  const listVersionRef = useRef(0);
  const cardsRef = useRef<MagicCard[]>([]);
  cardsRef.current = cards;
  const [selectedCard, setSelectedCard] = useState<MagicCard | null>(null);
  // Filter by category and by the search text. Some lists (collection, wishlist)
  // ignore the search on the backend, so we also filter here.
  const searchText = props.query.trim().toLowerCase();

  // Goes up by 1 each time the screen comes into view, which makes the list reload.
  const [refreshCount, setRefreshCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (props.refreshOnFocus) {
        setRefreshCount((count) => count + 1);
        listVersionRef.current += 1;
      }
    }, [props.refreshOnFocus]),
  );

  // Which card's + menu is open (null = none).
  const [menuCardId, setMenuCardId] = useState<string | null>(null);
  // The listing / collection panel that's open (null = none).
  const [sheet, setSheet] = useState<{
    type: SheetType;
    card: MagicCard;
  } | null>(null);
  // The message in the bar at the bottom (null = hidden).
  const [message, setMessage] = useState<string | null>(null);

  // Ids of the cards on your wishlist, so the menu knows Add or Remove.
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  // How many of each card you own (card id → quantity).
  const [ownedQuantities, setOwnedQuantities] = useState<Map<string, number>>(
    new Map(),
  );
  const insets = useSafeAreaInsets();

  // Reload the wishlist every time this screen comes into view.
  useFocusEffect(
    useCallback(() => {
      fetchWishlistIds()
        .then(setWishlistIds)
        .catch(() => setWishlistIds(new Set()));
      fetchOwnedQuantities()
        .then(setOwnedQuantities)
        .catch(() => setOwnedQuantities(new Map()));
    }, []),
  );

  // Add or remove one id. Makes a NEW Set, because React only redraws
  // when it gets a new object, not when the old one is changed.
  function setInWishlist(cardId: string, inWishlist: boolean) {
    setWishlistIds((current) => {
      const next = new Set(current);
      if (inWishlist) {
        next.add(cardId);
      } else {
        next.delete(cardId);
      }
      return next;
    });
  }

  const closeMenu = () => setMenuCardId(null);

  // Is the ADD TO menu in the fullscreen view open?
  const [previewMenuOpen, setPreviewMenuOpen] = useState(false);

  // Closes the fullscreen view, and its menu, so it starts closed next time.
  function closePreview() {
    setSelectedCard(null);
    setPreviewMenuOpen(false);
  }

  function openSheet(type: SheetType, card: MagicCard) {
    closeMenu();
    setPreviewMenuOpen(false);
    setSheet({ type, card });
  }

  async function toggleWishlist(card: MagicCard) {
    closeMenu();
    setPreviewMenuOpen(false);
    const inWishlist = wishlistIds.has(card.id);
    try {
      await updateCollectionCard({
        card_id: card.id,
        quantity: 0,
        for_trade: false,
        wishlist: !inWishlist,
      });
      setInWishlist(card.id, !inWishlist);
      setMessage(
        inWishlist
          ? `${card.name} removed from your wishlist`
          : `${card.name} added to your wishlist`,
      );
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
      setInWishlist(card.id, false);
      setOwnedQuantities((current) => {
        const next = new Map(current);
        next.set(card.id, (current.get(card.id) ?? 0) + quantity);
        return next;
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
          props.fetchlist(searchText, props.activeFilter, 1, 20),
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
  }, [searchText, props.activeFilter, props.fetchlist, refreshCount]);
  async function loadMore() {
    if (loading || !pagination || loadingMoreRef.current) return;
    if (pagination.page >= pagination.totalPages) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    const version = listVersionRef.current;

    try {
      const result = await props.fetchlist(
        searchText,
        props.activeFilter,
        pagination.page + 1,
        20,
      );

      if (version !== listVersionRef.current) return;

      // Only keep cards we don't already have. Some lists send everything
      // on every page, which would otherwise repeat the cards forever.
      const shownIds = new Set(cardsRef.current.map((card) => card.id));
      const newCards = result.items.filter((card) => !shownIds.has(card.id));

      if (newCards.length === 0) {
        // Nothing new came back, so treat this as the last page and stop asking.
        setPagination((p) => (p ? { ...p, totalPages: p.page } : p));
        return;
      }

      setCards((previousCards) => [...previousCards, ...newCards]);
      setPagination(result.pagination);
    } catch {
      if (version === listVersionRef.current) {
        setMessage('Could not load more cards. Please try again.');
      }
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }
  const variant = props.variant ?? 'browse';

  // Profile → My Wishlist: take it off the wishlist and out of this list.
  async function removeFromWishlist(card: MagicCard) {
    closeMenu();
    try {
      await updateCollectionCard({
        card_id: card.id,
        quantity: 0,
        for_trade: false,
        wishlist: false,
      });
      setInWishlist(card.id, false);
      setCards((current) => current.filter((c) => c.id !== card.id));
      setMessage(`${card.name} removed from your wishlist`);
    } catch {
      setMessage('Could not update your wishlist. Please try again.');
    }
  }

  // Profile → My Listings: stop trading it (you still own it) and take it out of this list.
  async function removeFromListings(card: MagicCard) {
    try {
      await updateCollectionCard({
        card_id: card.id,
        quantity: 0,
        for_trade: false,
        wishlist: false,
      });
      setCards((current) => current.filter((c) => c.id !== card.id));
      setMessage(`${card.name} removed from your listings`);
    } catch {
      setMessage('Could not remove the listing. Please try again.');
    }
  }

  // The listing / collection panel, built once so we can show it in two places.
  const sheetPanel = sheet && (
    <AddToSheet
      type={sheet.type}
      card={sheet.card}
      onClose={() => setSheet(null)}
      onConfirm={handleConfirm}
    />
  );

  const renderItem = ({ item: card }: { item: MagicCard }) => (
    <View key={card.id} style={styles.card}>
      <Pressable
        onPress={() => setSelectedCard(card)}
        accessibilityRole='button'
        accessibilityLabel={`View ${card.name}${
          (ownedQuantities.get(card.id) ?? 0) > 0
            ? `, you own ${ownedQuantities.get(card.id)}`
            : ''
        }${wishlistIds.has(card.id) ? ', on your wishlist' : ''}`}
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
        <Text style={styles.cardPriceLabel} numberOfLines={1}>
          {card.setName || ' '}
        </Text>

        {/* Tags: how many you own, and whether it's on your wishlist */}
        {((ownedQuantities.get(card.id) ?? 0) > 0 ||
          wishlistIds.has(card.id)) && (
          <View style={styles.tagRow}>
            {(ownedQuantities.get(card.id) ?? 0) > 0 && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>
                  OWNED ×{ownedQuantities.get(card.id)}
                </Text>
              </View>
            )}
            {wishlistIds.has(card.id) && (
              <View style={[styles.tag, styles.tagWishlist]}>
                <Ionicons name='heart' size={11} color='#FFFFFF' />
                <Text style={[styles.tagText, styles.tagTextLight]}>
                  WISHLIST
                </Text>
              </View>
            )}
          </View>
        )}
        {variant === 'listings' && (
          <Text style={styles.listedInfo}>
            Listed ×{(card as CollectionCard).quantity} ·{' '}
            {conditionLabel((card as CollectionCard).condition)}
          </Text>
        )}

        {/* Price on the left, + on the right */}
        <View style={styles.cardPriceRow}>
          <View>
            <Text style={styles.cardPriceLabel}>
              {card.finishes.includes('nonfoil') ? '' : 'foil'}
            </Text>
            <Text style={styles.cardPrice}>
              {card.prices.usd ? `$${card.prices.usd}` : '—'}
            </Text>
          </View>
          {variant === 'listings' ? (
            // My Listings: ✕ removes the card from your listings
            <Pressable
              onPress={() => removeFromListings(card)}
              accessibilityRole='button'
              accessibilityLabel={`Remove ${card.name} from your listings`}
              hitSlop={4}
              style={styles.removeButton}
            >
              <Ionicons name='close' size={22} color='#7A2E22' />
            </Pressable>
          ) : variant === 'wishlist' ? (
            // My Wishlist: filled heart opens a menu with "Remove from wishlist"
            <Menu
              visible={menuCardId === card.id}
              onDismiss={closeMenu}
              anchorPosition='bottom'
              contentStyle={styles.menu}
              anchor={
                <Pressable
                  onPress={() => setMenuCardId(card.id)}
                  accessibilityRole='button'
                  accessibilityLabel={`${card.name} is on your wishlist. Show options`}
                  hitSlop={4}
                  style={styles.heartButton}
                >
                  <Ionicons name='heart' size={20} color='#FFFFFF' />
                </Pressable>
              }
            >
              <Menu.Item
                leadingIcon={menuIcon('heart-dislike-outline')}
                title='Remove from wishlist'
                titleStyle={styles.menuItemText}
                onPress={() => removeFromWishlist(card)}
              />
            </Menu>
          ) : (
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
                leadingIcon={menuIcon(
                  wishlistIds.has(card.id) ? 'heart' : 'heart-outline',
                )}
                title={
                  wishlistIds.has(card.id)
                    ? 'Remove from wishlist'
                    : 'Add to wishlist'
                }
                titleStyle={styles.menuItemText}
                onPress={() => toggleWishlist(card)}
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
          )}
        </View>
      </View>
    </View>
  );
  return (
    <View style={{ height: '90%' }}>
      <FlatList
        data={cards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={[menuCardId, wishlistIds, ownedQuantities]}
        numColumns={2}
        columnWrapperStyle={styles.cardNameRow}
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={styles.emptyState} color='#171717' />
          ) : error ? (
            <View style={styles.emptyState}>
              <Ionicons name='alert-circle-outline' size={36} color='#77705F' />
              <Text style={styles.emptyTitle}>Something went wrong</Text>
              <Text style={styles.emptyText}>{error}</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name='search-outline' size={36} color='#77705F' />
              <Text style={styles.emptyTitle}>No cards found</Text>
              <Text style={styles.emptyText}>
                Try another search or category.
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {loadingMore && (
              <ActivityIndicator style={{ marginBottom: 20 }} color='#171717' />
            )}
            <Text style={styles.footerText}>
              TCG HUB · YOUR NEXT TRADE STARTS HERE
            </Text>
          </View>
        }
      />

      <Modal
        visible={selectedCard !== null}
        transparent
        animationType='fade'
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={closePreview}
      >
        {selectedCard && (
          <View
            style={[
              styles.preview,
              { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 },
            ]}
          >
            {/* While the menu is open, tapping anywhere else closes it */}
            {previewMenuOpen && (
              <Pressable
                style={styles.menuCatcher}
                onPress={() => setPreviewMenuOpen(false)}
                accessibilityRole='button'
                accessibilityLabel='Close menu'
              />
            )}

            {/* Top: close button on the right */}
            <View style={styles.previewTopRow}>
              <Pressable
                style={styles.previewClose}
                onPress={closePreview}
                accessibilityRole='button'
                accessibilityLabel='Close preview'
              >
                <Ionicons name='close' size={22} color='#E2D7BD' />
              </Pressable>
            </View>

            {/* Middle: the card, as big as fits */}
            <View style={styles.previewImageArea}>
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
            </View>

            {/* Name and set */}
            <View style={styles.previewInfo}>
              <Text style={styles.previewName} numberOfLines={2}>
                {selectedCard.name}
              </Text>
              <Text style={styles.previewSetName} numberOfLines={1}>
                {selectedCard.setName || 'Set information unavailable'}
              </Text>
            </View>

            {/* Bottom bar: price on the left, ADD TO on the right */}
            <View style={styles.previewBar}>
              <View>
                <Text style={styles.previewPriceLabel}>MARKET PRICE</Text>
                <Text style={styles.previewPrice}>
                  {selectedCard.prices.usd
                    ? `$${selectedCard.prices.usd}`
                    : '—'}
                </Text>
              </View>

              <Pressable
                onPress={() => setPreviewMenuOpen((open) => !open)}
                accessibilityRole='button'
                accessibilityLabel={`Add ${selectedCard.name} to…`}
                accessibilityState={{ expanded: previewMenuOpen }}
                style={[
                  styles.previewAddButton,
                  previewMenuOpen && styles.previewAddButtonActive,
                ]}
              >
                <Ionicons name='add' size={20} color='#FFFFFF' />
                <Text style={styles.previewAddText}>ADD TO</Text>
              </Pressable>

              {/* Same items as the grid menu, drawn ourselves because Paper's <Menu> can't show inside a Modal */}
              {previewMenuOpen && (
                <View style={[styles.menu, styles.previewMenu]}>
                  <Menu.Item
                    leadingIcon={menuIcon(
                      wishlistIds.has(selectedCard.id)
                        ? 'heart'
                        : 'heart-outline',
                    )}
                    title={
                      wishlistIds.has(selectedCard.id)
                        ? 'Remove from wishlist'
                        : 'Add to wishlist'
                    }
                    titleStyle={styles.menuItemText}
                    onPress={() => toggleWishlist(selectedCard)}
                  />
                  <Menu.Item
                    leadingIcon={menuIcon('pricetag-outline')}
                    title='Add to my listings'
                    titleStyle={styles.menuItemText}
                    onPress={() => openSheet('listing', selectedCard)}
                  />
                  <Menu.Item
                    leadingIcon={menuIcon('albums-outline')}
                    title='Add to collection'
                    titleStyle={styles.menuItemText}
                    onPress={() => openSheet('collection', selectedCard)}
                  />
                  <View style={styles.menuDivider} />
                  <Menu.Item
                    leadingIcon={menuIcon('layers-outline')}
                    title='Add to deck'
                    titleStyle={styles.menuItemText}
                    onPress={() => setPreviewMenuOpen(false)}
                  />
                </View>
              )}
            </View>

            {/* Message bar, drawn inside the popup so it isn't hidden behind it */}
            <Snackbar
              visible={message !== null}
              onDismiss={() => setMessage(null)}
              duration={2500}
              wrapperStyle={{ bottom: insets.bottom + 110 }}
            >
              {message ?? ''}
            </Snackbar>

            {/* From the fullscreen view: the panel has to be inside this Modal on iOS */}
            {sheetPanel}
          </View>
        )}
      </Modal>

      {/* From the grid: show the panel normally */}
      {!selectedCard && sheetPanel}

      {/* Portal = draw at the top level of the app, so it's never cut off */}
      <Portal>
        <Snackbar
          visible={message !== null}
          onDismiss={() => setMessage(null)}
          duration={2500}
          wrapperStyle={{ bottom: insets.bottom + 64 }}
        >
          {message ?? ''}
        </Snackbar>
      </Portal>
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
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 11,
    backgroundColor: '#E2D7BD',
  },
  tagWishlist: {
    backgroundColor: '#2e7d32',
  },
  tagText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 12,
    letterSpacing: 0.8,
    color: '#3A342B',
  },
  tagTextLight: {
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
    textAlign: 'center',
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
  heartButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#2e7d32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#7A2E22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listedInfo: {
    marginTop: -4,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#3A342B',
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
  preview: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#171717',
  },
  menuCatcher: {
    ...StyleSheet.absoluteFill,
  },
  previewTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  previewClose: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2C2A26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImageArea: {
    flex: 1,
    paddingVertical: 12,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewInfo: {
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  previewName: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 28,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#F4EEDF',
  },
  previewSetName: {
    marginTop: 2,
    fontSize: 14,
    color: '#A79E8B',
  },
  previewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    paddingLeft: 18,
    paddingRight: 14,
    borderRadius: 18,
    backgroundColor: '#E2D7BD',
  },
  previewPriceLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#5A5246',
  },
  previewPrice: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 30,
    color: '#171717',
  },
  previewAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 52,
    paddingLeft: 16,
    paddingRight: 20,
    borderRadius: 14,
    backgroundColor: '#2e7d32',
  },
  previewAddButtonActive: {
    backgroundColor: '#171717',
  },
  previewAddText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 18,
    letterSpacing: 1.2,
    color: '#FFFFFF',
  },
  previewMenu: {
    position: 'absolute',
    right: 0,
    bottom: '100%',
    marginBottom: 10,
    width: 250,
    paddingVertical: 6,
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
  },
});
