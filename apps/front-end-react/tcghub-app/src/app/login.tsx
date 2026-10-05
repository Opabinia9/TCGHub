import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import React from 'react';
import { useRouter, useSegments, Href } from 'expo-router';
import HomeScreen from './(drawer)/home'; // Your screen component
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const router = useRouter();
  const currentRoute = 'login';
  const navigateTo = (routeName: Href) => {
    router.navigate(routeName);
  }

  return (
    <SafeAreaView>
	 <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: theme.colors.background }}>
      <Text variant="headlineMedium">Home</Text>
      <Button mode="contained" onPress={() => {}}>Button</Button>
    </View>
    </SafeAreaView>
  );
}
