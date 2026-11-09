import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import TradeList from '@/components/trade-list';

export default function TradeScreen() {
  return (
    <View style={styles.screen}>
      {/* Header (doesn't scroll) */}
      <View style={styles.top}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            LISTED CARDS
          </Text>

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
        </View>
        <Text style={styles.subtitle}>Buy, sell and trade with players near you.</Text>
      </View>

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
  top: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    flex: 1,
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 40,
    lineHeight: 44,
    color: '#171717',
  },
  subtitle: {
    fontSize: 14,
    color: '#5A5246',
    marginTop: 2,
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
