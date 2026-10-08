import { Drawer } from "expo-router/drawer";
import { Drawer as PaperDrawer, useTheme } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { useRouter, useSegments, Href } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { Image } from "expo-image";

function CustomDrawerContent() {
	const router = useRouter();
	const segments = useSegments();
	const currentRoute = segments[0] || "(drawer)";
	const navigateTo = (routeName: Href) => {
		router.navigate(routeName);
	};

	return (
		<View style={styles.drawer}>
			<View style={styles.imageContainer}>
				<Image
					source={require("@/assets/images/tcghub_banner.png")}
					style={styles.imageContainer}
					contentFit="cover"
				/>
			</View>
			<PaperDrawer.Section>
				<PaperDrawer.Item
					label="Home"
					icon="home"
					active={currentRoute === "home"}
					onPress={() => navigateTo("/home")}
				/>

				<PaperDrawer.Item
					label="Cards"
					icon="cards"
					active={currentRoute === "cards"}
					onPress={() => navigateTo("/cards")}
				/>

				<PaperDrawer.Item
					label="Decks"
					icon="layers"
					active={currentRoute === "decks"}
					onPress={() => navigateTo("/decks")}
				/>

				<PaperDrawer.Item
					label="Players"
					icon="human"
					active={currentRoute === "players"}
					onPress={() => navigateTo("/players")}
				/>

				<PaperDrawer.Item
					label="Chat"
					icon="chat"
					active={currentRoute === "chat"}
					onPress={() => navigateTo("/chat")}
				/>

				<PaperDrawer.Item
					label="Collection"
					icon="book-open-page-variant"
					active={currentRoute === "collection"}
					onPress={() => navigateTo("/collection")}
				/>

				<PaperDrawer.Item
					label="Trades"
					icon="handshake"
					active={currentRoute === "trades"}
					onPress={() => navigateTo("/trades")}
				/>
			</PaperDrawer.Section>

			<View style={styles.content}>
				<PaperDrawer.Section title="Account">
					<PaperDrawer.Item
						label="Settings"
						icon="cog"
						active={currentRoute === "settings"}
						onPress={() => navigateTo("/settings")}
					/>
				</PaperDrawer.Section>

				<PaperDrawer.Section>
					<PaperDrawer.Item
						label="Profile"
						icon="wizard-hat"
						active={currentRoute === "profile"}
						onPress={() => navigateTo("/profile")}
					/>
				</PaperDrawer.Section>
			</View>
		</View>
	);
}

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<PaperProvider>
				<Drawer
					drawerContent={(props) => <CustomDrawerContent />}
					screenOptions={{
						headerShown: false, // Shows standard toggle header
					}}
				>
					<Drawer.Screen name="home" />
					<Drawer.Screen name="profile" />
				</Drawer>
			</PaperProvider>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	drawer: {
		backgroundColor: "#E2D7BD",
		flex: 1,
		borderTopRightRadius: 16,
		borderWidth: 3,
		borderColor: "black",
	},
	content: {
		flex: 1,
		justifyContent: "flex-end",
	},
	imageContainer: {
		alignItems: "center",
		width: "100%",
		height: 160,
		borderTopRightRadius: 10,
		overflow: "hidden",
	},
});
