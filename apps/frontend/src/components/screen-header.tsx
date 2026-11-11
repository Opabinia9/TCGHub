import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode; //a button on the right of the title
};

// The big title at the top of each tab, so every tab looks the same.
export default function ScreenHeader({ title, subtitle, right }: ScreenHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={1} accessibilityRole='header'>
          {title}
        </Text>
        {right}
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  row: {
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
    marginTop: 2,
    fontSize: 14,
    color: '#5A5246',
  },
});
