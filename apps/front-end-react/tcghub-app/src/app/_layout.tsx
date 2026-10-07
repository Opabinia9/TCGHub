import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
	const scheme = useColorScheme() === "dark" ? MD3DarkTheme : MD3LightTheme;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<PaperProvider theme={scheme}>
				<SafeAreaView style={{ flex: 1, backgroundColor: "#2F4F4F" }}>
					<Stack screenOptions={{ headerShown: false }} />
				</SafeAreaView>
			</PaperProvider>
		</GestureHandlerRootView>
	);
}
