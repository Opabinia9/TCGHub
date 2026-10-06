import { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useRouter, useSegments, Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/header';

export default function Login() {
  const router = useRouter();
  const currentRoute = 'login';
  const navigateTo = (routeName: Href) => {
    router.navigate(routeName);
  }

  const [email, setEmail] = useState('');
  const [passwd, setPasswd] = useState('');
  const handleLogin = async () => {
	const response = await fetch("http://100.90.100.12:8080/api/v1/auth/login",
	  {method: "POST",
		body: JSON.stringify(
		  {
			email: email,
			password: passwd
		  })
	  }
	);
	console.log(response);

	if (response.ok === true) {
	  navigateTo('/(drawer)/home')
	} else {
	  navigateTo('/(drawer)/login')
	}
  }

  return (
    <SafeAreaView>
	  <Header text="login" style={styles.header}/>
	  <TextInput
		placeholder="Enter Username"
		onChangeText={newEmail => setEmail(newEmail)}
		defaultValue={email}
		style={styles.input}/>
	  <TextInput
		placeholder="Enter Password"
		onChangeText={newPasswd => setPasswd(newPasswd)}
		defaultValue={passwd}
		style={styles.input} />
	  <Button children="Login" onPress={handleLogin}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
	backgroundColor: "#2F4F4F",
	borderWidth: 0,
	color: "#000000"
  },
  input: {
	backgroundColor: "#FFFFFF",
	borderWidth: 1,
	borderColor: "#000000",
	marginTop: 10,
  },
});
