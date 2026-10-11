import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function Decks() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#E2D7BD',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text variant="headlineMedium" style={{ color: '#171717' }}>
        Decks
      </Text>
    </View>
  );
}