import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

export default function Settings() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
      <Text variant="headlineMedium">Settings</Text>
      <Button mode="contained" onPress={() => {}}>Button</Button>
    </View>
  );
}
