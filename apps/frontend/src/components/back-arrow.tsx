import { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '@/constants/theme';

export default function BackArrow(): ReactNode {
  return (
    <Pressable
      onPress={() => router.back()}
      accessibilityRole='button'
      accessibilityLabel='Back to messages'
      style={styles.backButton}
    >
      <Ionicons name='chevron-back' size={26} color='#171717' />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.surfaceElevated,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
