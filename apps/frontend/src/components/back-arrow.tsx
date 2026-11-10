import { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { chatStyles } from '@/constants/chatStyles';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BackArrrow(): ReactNode {
  return (
    <Pressable
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel="Back to messages"
      style={chatStyles.iconButton}
    >
      <Ionicons name="chevron-back" size={26} color="#171717" />
    </Pressable>
  );
}
