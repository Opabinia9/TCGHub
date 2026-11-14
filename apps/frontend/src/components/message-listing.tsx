import { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { chatStyles } from '@/constants/chatStyles';
import { useQuery } from '@tanstack/react-query';
import { fetchTrade } from '@/api/tradeListings';

type Props = { sellerId: string | undefined; cardId: string | undefined };
export default function MessageListing({ sellerId, cardId }: Props): ReactNode {
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
        onPress={() => console.log('View listing', cardId)}
        accessibilityRole="button"
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
            contentFit="cover"
          />
        </View>
        <View style={chatStyles.listingText}>
          <Text style={chatStyles.listingName}>{trade?.Card.name}</Text>
          <Text style={chatStyles.listingDetail}>{trade?.condition}</Text>
        </View>
        <Text style={chatStyles.listingLink}>View listing</Text>
      </Pressable>
    </View>
  );
}
