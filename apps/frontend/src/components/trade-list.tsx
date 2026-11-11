import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Portal, Snackbar } from 'react-native-paper';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ListingCard } from '@/api/types';
import { fetchTradeListings } from '@/api/tradeListings';
import { fetchWishlistIds, updateCollectionCard } from '@/api/collection';
import { createTradeChat, fetchChats } from '@/api/chats';
import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/utils/auth-client';

// Cards other players have listed for trade.
type TradeListProps = {
  query: string; // search text from the Trades screen
};

export default function TradeList({ query }: TradeListProps) {
  const insets = useSafeAreaInsets();
  const [listings, setListings] = useState<ListingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);
  const { data: chats } = useQuery({
    queryKey: ['chats'],
    queryFn: fetchChats,
  });
  const selfId = authClient.useSession().data?.user.id;

  // Load the listings and your wishlist every time the Trades tab comes into view.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      setError(null);

      Promise.all([fetchTradeListings(''), fetchWishlistIds().catch(() => new Set<string>())])
        .then(([page, ids]) => {
          if (cancelled) return;
          setListings(page.items as ListingCard[]);
          setWishlistIds(ids);
        })
        .catch(() => {
          if (!cancelled) setError('Unable to load listings. Please try again later.');
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });

      // If you leave the tab before it finishes loading, ignore the result.
      return () => {
        cancelled = true;
      };
    }, []),
  );

  async function toggleWishlist(card: ListingCard) {
    const inWishlist = wishlistIds.has(card.id);
    try {
      await updateCollectionCard({
        card_id: card.id,
        quantity: 0,
        for_trade: false,
        wishlist: !inWishlist,
      });
      setWishlistIds((current) => {
        const next = new Set(current);
        if (inWishlist) {
          next.delete(card.id);
        } else {
          next.add(card.id);
        }
        return next;
      });
      setMessage(
        inWishlist
          ? `${card.name} removed from your wishlist`
          : `${card.name} added to your wishlist`,
      );
    } catch {
      setMessage('Could not update your wishlist. Please try again.');
    }
  }

  const messageSeller = async (sellerId: string, cardId: string) => {
    console.log('A');
    if (chats) {
      console.log('HERE?');
      for (const chat of chats) {
        if (chat.directKey === `${selfId}:${sellerId}:${cardId}`) {
          console.log('Please');
          router.push({ pathname: '/chat/[id]', params: { id: chat.id } });
          return;
        }
      }
    }
    const chatId = await createTradeChat(sellerId, cardId);
    router.push({ pathname: '/chat/[id]', params: { id: chatId } });
  };
  // Only show listings whose card name contains the search text.
  const searchText = query.trim().toLowerCase();
  const shownListings = listings.filter((item) => item.name.toLowerCase().includes(searchText));

  const renderItem = ({ item }: { item: ListingCard }) => {
    const inWishlist = wishlistIds.has(item.id);
    const condition =
      item.condition && item.condition !== 'unmarked' ? item.condition : 'Condition not set';

    return (
      <View style={styles.card}>
        <Image
          source={{
            uri: item.imageUris?.normal ?? item.imageUris?.grid ?? undefined,
          }}
          style={styles.cardImage}
          contentFit="cover"
        />

        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.cardCondition}>
            {condition} · ×{item.quantity}
          </Text>
          <View style={styles.sellerRow}>
            <Ionicons name="person-outline" size={13} color="#3A342B" />
            {/* TODO: show the seller's username once the API includes it */}
            <Text style={styles.sellerText}>{item.username}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            onPress={async () => await messageSeller(item.user_id, item.id)}
            accessibilityRole="button"
            accessibilityLabel={`Message the seller about ${item.name}`}
            style={styles.messageButton}
          >
            <Ionicons name="chatbubble-outline" size={17} color="#171717" />
            <Text style={styles.messageButtonText}>MESSAGE</Text>
          </Pressable>

          <Pressable
            onPress={() => toggleWishlist(item)}
            accessibilityRole="button"
            accessibilityState={{ selected: inWishlist }}
            accessibilityLabel={
              inWishlist ? `Remove ${item.name} from wishlist` : `Add ${item.name} to wishlist`
            }
            style={[styles.wishlistButton, inWishlist && styles.wishlistButtonActive]}
          >
            <Ionicons
              name={inWishlist ? 'heart' : 'heart-outline'}
              size={20}
              color={inWishlist ? '#FFFFFF' : '#171717'}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={shownListings}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.user_id}-${item.id}`}
        extraData={wishlistIds}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={styles.loading} color="#171717" />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name={error ? 'alert-circle-outline' : 'search-outline'}
                size={36}
                color="#77705F"
              />
              <Text style={styles.emptyTitle}>
                {error
                  ? 'Something went wrong'
                  : searchText
                    ? 'No cards found'
                    : 'No cards listed yet'}
              </Text>
              <Text style={styles.emptyText}>
                {error ??
                  (searchText
                    ? 'Try another search.'
                    : 'Check back soon, or list one of your own.')}
              </Text>
            </View>
          )
        }
      />

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
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    gap: 8,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 63 / 88,
    borderRadius: 10,
    backgroundColor: '#D1C4A8',
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
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  messageButton: {
    flex: 1,
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
  wishlistButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistButtonActive: {
    backgroundColor: '#2e7d32',
    borderColor: '#2e7d32',
  },
  loading: {
    marginTop: 40,
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
    textAlign: 'center',
  },
});
