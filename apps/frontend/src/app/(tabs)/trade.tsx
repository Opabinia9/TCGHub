import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import TradeList from '@/components/trade-list';
import ScreenHeader from '@/components/screen-header';

export default function TradeScreen() {
  return (
    <View style={styles.screen}>
      <ScreenHeader
        title='LISTED CARDS'
        subtitle='Buy, sell and trade with players near you.'
        right={
          <Pressable
            onPress={() =>
              router.navigate({ pathname: '/(tabs)/decks', params: { tab: 'collection' } })
            }
            accessibilityRole='button'
            accessibilityLabel='List a card'
            style={styles.listButton}
          >
            <Ionicons name='add' size={18} color='#FFFFFF' />
            <Text style={styles.listButtonText}>LIST A CARD</Text>
          </Pressable>
        }
      />

      {/* Real listings from other players (scrolls by itself) */}
      <TradeList />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E2D7BD',
  },
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 44,
    paddingLeft: 10,
    paddingRight: 14,
    borderRadius: 12,
    backgroundColor: '#2e7d32',
  },
  listButtonText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 15,
    letterSpacing: 1.2,
    color: '#FFFFFF',
  },
});
