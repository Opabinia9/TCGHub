import { useState } from "react";
import { TextInput, StyleSheet, Pressable, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useRouter, useSegments, Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header";

export default function Login() {
	const router = useRouter();
	const navigateTo = (routeName: Href) => {
		router.navigate(routeName);
	};

	const [email, setEmail] = useState("");
	const [passwd, setPasswd] = useState("");
	const [passwdVisibility, setPasswdvisibility] = useState(true);
	const togglePasswd = () =>
		setPasswdvisibility((previousState) => !previousState);
	const handleLogin = async () => {
		// TODO: load port and ip from env
		const response = await fetch(
			"http://100.90.100.12:8080/api/v1/auth/login",
			{
				method: "POST",
				body: JSON.stringify({
					email: email,
					password: passwd,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		console.log(response);

		if (response.ok === true) {
			navigateTo("/(drawer)/home");
		} else {
			navigateTo("./index");
		}
	};

	return (
		<SafeAreaView>
			<Header text="login" style={styles.header} />
			<TextInput
				placeholder="Enter Email"
				onChangeText={(newEmail) => setEmail(newEmail)}
				defaultValue={email}
				style={styles.input}
			/>
			<View>
				<View>
					<TextInput
						placeholder="Enter Password"
						onChangeText={(newPasswd) => setPasswd(newPasswd)}
						defaultValue={passwd}
						style={styles.input}
						secureTextEntry={passwdVisibility}
					></TextInput>
				</View>
			</View>
			<Button children="Login" onPress={handleLogin} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: "#2F4F4F",
		borderWidth: 0,
		color: "#000000",
	},
	input: {
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#000000",
		marginTop: 10,
	},
});
