import { useState, useRef, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  type CardListProps,
  type CollectionCard,
  type MagicCard,
  type Pagination,
} from '@/api/types';
import { ActivityIndicator, Pressable, Text, View, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { FlatList } from 'react-native-gesture-handler';
import { Menu, Portal, Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddToSheet, { type Condition, type SheetType } from '@/components/add-to-sheet';
import { fetchOwnedQuantities, fetchWishlistIds, updateCollectionCard } from '@/api/collection';
import { fetchCards } from '@/api/cards';
import { cardStyles } from '@/constants/card-container';
import { cardListStyles } from '@/constants/card-list-styles';

// Draws an Ionicons icon in our green, for a menu item.
function menuIcon(name: keyof typeof Ionicons.glyphMap) {
  return ({ size }: { size: number }) => <Ionicons name={name} size={size} color="#245f28" />;
}

function conditionLabel(condition: string) {
  return condition && condition !== 'unmarked' ? condition : 'Condition not set';
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
  const [ownedQuantities, setOwnedQuantities] = useState<Map<string, number>>(new Map());
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
      const result = await props.fetchlist(searchText, props.activeFilter, pagination.page + 1, 20);

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
    <View key={card.id} style={cardStyles.card}>
      <Pressable
        onPress={() => setSelectedCard(card)}
        accessibilityRole="button"
        accessibilityLabel={`View ${card.name}${
          (ownedQuantities.get(card.id) ?? 0) > 0 ? `, you own ${ownedQuantities.get(card.id)}` : ''
        }${wishlistIds.has(card.id) ? ', on your wishlist' : ''}`}
        style={cardStyles.imageContainer}
      >
        <Image
          source={{
            uri: card.imageUris?.grid ?? card.imageUris?.normal ?? undefined,
          }}
          style={cardStyles.cardImage}
          contentFit="cover"
        />

        <View style={cardStyles.expandIcon}>
          <Ionicons name="expand-outline" size={18} color="#FFFFFF" />
        </View>
      </Pressable>

      <View style={cardStyles.cardInfo}>
        <Text style={cardStyles.cardPriceLabel} numberOfLines={1}>
          {card.setName || ' '}
        </Text>

        {/* Tags: how many you own, and whether it's on your wishlist */}
        {((ownedQuantities.get(card.id) ?? 0) > 0 || wishlistIds.has(card.id)) && (
          <View style={cardStyles.tagRow}>
            {(ownedQuantities.get(card.id) ?? 0) > 0 && (
              <View style={cardStyles.tag}>
                <Text style={cardStyles.tagText}>OWNED ×{ownedQuantities.get(card.id)}</Text>
              </View>
            )}
            {wishlistIds.has(card.id) && (
              <View style={[cardStyles.tag, cardStyles.tagWishlist]}>
                <Ionicons name="heart" size={11} color="#FFFFFF" />
                <Text style={[cardStyles.tagText, cardStyles.tagTextLight]}>WISHLIST</Text>
              </View>
            )}
          </View>
        )}
        {variant === 'trades' && (
          <Text style={cardStyles.listedInfo}>
            Listed ×{(card as CollectionCard).quantity} ·{' '}
            {conditionLabel((card as CollectionCard).condition)}
          </Text>
        )}

        {/* Price on the left, + on the right */}
        <View style={cardStyles.cardPriceRow}>
          <View>
            <Text style={cardStyles.cardPriceLabel}>
              {card.finishes.includes('nonfoil') ? '' : 'foil'}
            </Text>
            <Text style={cardStyles.cardPrice}>
              {card.prices.usd ? `$${card.prices.usd}` : '—'}
            </Text>
          </View>
          {variant === 'trades' ? (
            // My Listings: ✕ removes the card from your listings
            <Pressable
              onPress={() => removeFromListings(card)}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${card.name} from your listings`}
              hitSlop={4}
              style={cardStyles.removeButton}
            >
              <Ionicons name="close" size={22} color="#7A2E22" />
            </Pressable>
          ) : variant === 'wishlist' ? (
            // My Wishlist: filled heart opens a menu with "Remove from wishlist"
            <Menu
              visible={menuCardId === card.id}
              onDismiss={closeMenu}
              anchorPosition="bottom"
              contentStyle={cardStyles.menu}
              anchor={
                <Pressable
                  onPress={() => setMenuCardId(card.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`${card.name} is on your wishlist. Show options`}
                  hitSlop={4}
                  style={cardStyles.heartButton}
                >
                  <Ionicons name="heart" size={20} color="#FFFFFF" />
                </Pressable>
              }
            >
              <Menu.Item
                leadingIcon={menuIcon('heart-dislike-outline')}
                title="Remove from wishlist"
                titleStyle={cardStyles.menuItemText}
                onPress={() => removeFromWishlist(card)}
              />
            </Menu>
          ) : (
            <Menu
              visible={menuCardId === card.id}
              onDismiss={closeMenu}
              anchorPosition="bottom"
              contentStyle={cardStyles.menu}
              anchor={
                <Pressable
                  onPress={() => setMenuCardId(card.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${card.name} to…`}
                  hitSlop={4}
                  style={[
                    cardStyles.addButton,
                    menuCardId === card.id && cardStyles.addButtonActive,
                  ]}
                >
                  <Ionicons
                    name="add"
                    size={22}
                    color={menuCardId === card.id ? '#E2D7BD' : '#171717'}
                  />
                </Pressable>
              }
            >
              <Menu.Item
                leadingIcon={menuIcon(wishlistIds.has(card.id) ? 'heart' : 'heart-outline')}
                title={wishlistIds.has(card.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                titleStyle={cardStyles.menuItemText}
                onPress={() => toggleWishlist(card)}
              />
              <Menu.Item
                leadingIcon={menuIcon('pricetag-outline')}
                title="Add to my listings"
                titleStyle={cardStyles.menuItemText}
                onPress={() => openSheet('listing', card)}
              />
              <Menu.Item
                leadingIcon={menuIcon('albums-outline')}
                title="Add to collection"
                titleStyle={cardStyles.menuItemText}
                onPress={() => openSheet('collection', card)}
              />
              <View style={cardStyles.menuDivider} />
              <Menu.Item
                leadingIcon={menuIcon('layers-outline')}
                title="Add to deck"
                titleStyle={cardStyles.menuItemText}
                onPress={closeMenu}
              />
            </Menu>
          )}
        </View>
      </View>
    </View>
  );
  const filteredCards =
    props.fetchlist === fetchCards
      ? cards
      : cards.filter((item) => item.name.toLowerCase().includes(searchText));
  return (
    <View>
      <FlatList
        data={filteredCards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={[menuCardId, wishlistIds, ownedQuantities]}
        numColumns={2}
        columnWrapperStyle={cardListStyles.cardNameRow}
        style={cardListStyles.container}
        contentContainerStyle={cardListStyles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListHeaderComponent={props.header ?? <View />}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={cardListStyles.emptyState} color="#171717" />
          ) : error ? (
            <View style={cardListStyles.emptyState}>
              <Ionicons name="alert-circle-outline" size={36} color="#77705F" />
              <Text style={cardListStyles.emptyTitle}>Something went wrong</Text>
              <Text style={cardListStyles.emptyText}>{error}</Text>
            </View>
          ) : (
            <View style={cardListStyles.emptyState}>
              <Ionicons name="search-outline" size={36} color="#77705F" />
              <Text style={cardListStyles.emptyTitle}>No cards found</Text>
              <Text style={cardListStyles.emptyText}>Try another search or category.</Text>
            </View>
          )
        }
        ListFooterComponent={
          <View style={cardListStyles.footer}>
            {loadingMore && <ActivityIndicator style={{ marginBottom: 20 }} color="#171717" />}
            <Text style={cardListStyles.footerText}>TCG HUB · YOUR NEXT TRADE STARTS HERE</Text>
          </View>
        }
      />

      <Modal
        visible={selectedCard !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={closePreview}
      >
        {selectedCard && (
          <View
            style={[
              cardListStyles.preview,
              { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 },
            ]}
          >
            {/* While the menu is open, tapping anywhere else closes it */}
            {previewMenuOpen && (
              <Pressable
                style={cardListStyles.menuCatcher}
                onPress={() => setPreviewMenuOpen(false)}
                accessibilityRole="button"
                accessibilityLabel="Close menu"
              />
            )}

            {/* Top: close button on the right */}
            <View style={cardListStyles.previewTopRow}>
              <Pressable
                style={cardListStyles.previewClose}
                onPress={closePreview}
                accessibilityRole="button"
                accessibilityLabel="Close preview"
              >
                <Ionicons name="close" size={22} color="#E2D7BD" />
              </Pressable>
            </View>

            {/* Middle: the card, as big as fits */}
            <View style={cardListStyles.previewImageArea}>
              <Image
                source={{
                  uri:
                    selectedCard.imageUris?.large ??
                    selectedCard.imageUris?.normal ??
                    selectedCard.imageUris?.grid ??
                    undefined,
                }}
                style={cardListStyles.previewImage}
                contentFit="contain"
              />
            </View>

            {/* Name and set */}
            <View style={cardListStyles.previewInfo}>
              <Text style={cardListStyles.previewName} numberOfLines={2}>
                {selectedCard.name}
              </Text>
              <Text style={cardListStyles.previewSetName} numberOfLines={1}>
                {selectedCard.setName || 'Set information unavailable'}
              </Text>
            </View>

            {/* Bottom bar: price on the left, ADD TO on the right */}
            <View style={cardListStyles.previewBar}>
              <View>
                <Text style={cardListStyles.previewPriceLabel}>MARKET PRICE</Text>
                <Text style={cardListStyles.previewPrice}>
                  {selectedCard.prices.usd ? `$${selectedCard.prices.usd}` : '—'}
                </Text>
              </View>

              <Pressable
                onPress={() => setPreviewMenuOpen((open) => !open)}
                accessibilityRole="button"
                accessibilityLabel={`Add ${selectedCard.name} to…`}
                accessibilityState={{ expanded: previewMenuOpen }}
                style={[
                  cardListStyles.previewAddButton,
                  previewMenuOpen && cardListStyles.previewAddButtonActive,
                ]}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={cardListStyles.previewAddText}>ADD TO</Text>
              </Pressable>

              {/* Same items as the grid menu, drawn ourselves because Paper's <Menu> can't show inside a Modal */}
              {previewMenuOpen && (
                <View style={[cardStyles.menu, cardListStyles.previewMenu]}>
                  <Menu.Item
                    leadingIcon={menuIcon(
                      wishlistIds.has(selectedCard.id) ? 'heart' : 'heart-outline',
                    )}
                    title={
                      wishlistIds.has(selectedCard.id) ? 'Remove from wishlist' : 'Add to wishlist'
                    }
                    titleStyle={cardStyles.menuItemText}
                    onPress={() => toggleWishlist(selectedCard)}
                  />
                  <Menu.Item
                    leadingIcon={menuIcon('pricetag-outline')}
                    title="Add to my listings"
                    titleStyle={cardStyles.menuItemText}
                    onPress={() => openSheet('listing', selectedCard)}
                  />
                  <Menu.Item
                    leadingIcon={menuIcon('albums-outline')}
                    title="Add to collection"
                    titleStyle={cardStyles.menuItemText}
                    onPress={() => openSheet('collection', selectedCard)}
                  />
                  <View style={cardStyles.menuDivider} />
                  <Menu.Item
                    leadingIcon={menuIcon('layers-outline')}
                    title="Add to deck"
                    titleStyle={cardStyles.menuItemText}
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
