import { ReactNode, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette } from '@/constants/theme';
import { Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { chatStyles } from '@/constants/chatStyles';
import { useQuery } from '@tanstack/react-query';
import { fetchTrade } from '@/api/tradeListings';

type Props = {
  sellerId: string | undefined;
  cardId: string | undefined;
  sellerName?: string;
  isOwnListing?: boolean;
};
export default function MessageListing({
  sellerId,
  cardId,
  sellerName,
  isOwnListing,
}: Props): ReactNode {
  const [previewOpen, setPreviewOpen] = useState(false);
  const insets = useSafeAreaInsets();

  if (!sellerId || !cardId) {
    return;
  }
  const { data: trade } = useQuery({
    queryKey: ['trade', sellerId, cardId],
    queryFn: async () => await fetchTrade(sellerId, cardId),
    staleTime: 60_000,
  });

  return (
    <View>
      <Pressable
        onPress={() => setPreviewOpen(true)}
        accessibilityRole='button'
        accessibilityLabel={`View listing: ${cardId}`}
        style={chatStyles.listing}
      >
        <View style={chatStyles.listingThumbFrame}>
          <View style={[chatStyles.listingThumb, { backgroundColor: '#FF0000' }]} />
          <Image
            source={{
              uri: trade?.Card.imageUris?.small ?? trade?.Card.imageUris?.normal ?? undefined,
            }}
            style={chatStyles.cardImage}
            contentFit='cover'
          />
        </View>
        <View style={chatStyles.listingText}>
          <Text style={chatStyles.listingName}>{trade?.Card.name}</Text>
          <Text style={chatStyles.listingDetail}>{trade?.condition}</Text>
        </View>
        <Text style={chatStyles.listingLink}>View listing</Text>
      </Pressable>

      <Modal
        visible={previewOpen}
        transparent
        animationType='fade'
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setPreviewOpen(false)}
      >
        <View
          style={[
            styles.preview,
            { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 },
          ]}
        >
          <View style={styles.previewTopRow}>
            <View style={styles.sellerInfo}>
              {isOwnListing ? (
                <Text style={styles.sellerName}>MY LISTING</Text>
              ) : (
                <>
                  <Text style={styles.sellerLabel}>LISTED BY</Text>
                  <Text style={styles.sellerName} numberOfLines={1}>
                    {sellerName ? `@${sellerName}` : 'Unknown seller'}
                  </Text>
                </>
              )}
            </View>

            <Pressable
              style={styles.previewClose}
              onPress={() => setPreviewOpen(false)}
              accessibilityRole='button'
              accessibilityLabel='Close preview'
            >
              <Ionicons name='close' size={22} color={Palette.text} />
            </Pressable>
          </View>

          <View style={styles.previewImageArea}>
            <Image
              source={{
                uri:
                  trade?.Card.imageUris?.large ??
                  trade?.Card.imageUris?.normal ??
                  trade?.Card.imageUris?.small ??
                  undefined,
              }}
              style={styles.previewImage}
              contentFit='contain'
            />
          </View>

          <View style={styles.previewInfo}>
            <Text style={styles.previewName} numberOfLines={2}>
              {trade?.Card.name}
            </Text>
            <Text style={styles.previewSetName} numberOfLines={1}>
              {trade?.Card.setName || 'Set information unavailable'}
            </Text>
          </View>

          <View style={styles.previewBar}>
            <View>
              <Text style={styles.previewPriceLabel}>MARKET PRICE</Text>
              <Text style={styles.previewPrice}>
                {trade?.Card.prices?.usd ? `$${trade.Card.prices.usd}` : '—'}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  preview: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Palette.background,
  },
   previewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Palette.textSecondary,
  },
  sellerName: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 22,
    color: Palette.text,
  },
  previewClose: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.surfaceElevated,
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
    color: Palette.text,
  },
  previewSetName: {
    marginTop: 2,
    fontSize: 14,
    color: Palette.textSecondary,
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
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  previewPriceLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Palette.textSecondary,
  },
  previewPrice: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 30,
    color: Palette.gold,
  },
});
