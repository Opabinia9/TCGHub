import { View, StyleProp, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default function Header(prop: {text: string, style?: StyleProp<ViewStyle>}) {
  const theme = useTheme();
  return (
    <View style={[styles.header, prop.style]}>
      <Text variant="headlineMedium">{prop.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flex: 1,
	alignItems: 'center',
	justifyContent: 'flex-start',
	padding: 10,
  }
});
