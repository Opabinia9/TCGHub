import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

export default function Trades() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
      <Text variant="headlineMedium">Trades</Text>
      <Button mode="contained" onPress={() => {}}>Button</Button>
    </View>
  );
}
