import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { ExternalLink } from '@/components/external-link';

export default function Home() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: theme.colors.background }}>
      <Text variant="headlineMedium">Home</Text>
      <Button mode="contained" onPress={() => {}}>Button</Button>
      <ExternalLink href="http://100.90.100.12:3000">
		<Text>Hi</Text>
	  </ExternalLink>
    </View>
  );
}
