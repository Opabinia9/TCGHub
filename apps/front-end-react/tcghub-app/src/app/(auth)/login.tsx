import { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://100.65.32.184:8080/api/v1/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        },
      );

      if (!response.ok) {
        setError('Login failed. Please check your details.');
        return;
      }

      router.replace('/(tabs)/home');
    } catch {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>TCG HUB</Text>
          <Text style={styles.subtitle}>YOUR NEXT TRADE STARTS HERE</Text>
        </View>

        <View style={styles.form}>
          <Text variant="headlineMedium" style={styles.title}>
            Welcome back
          </Text>

          <Text style={styles.description}>
            Sign in to connect with other Planeswalkers.
          </Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            outlineColor="#C7B99E"
            activeOutlineColor="#171717"
            textColor="#171717"
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!passwordVisible}
            outlineColor="#C7B99E"
            activeOutlineColor="#171717"
            textColor="#171717"
            style={styles.input}
            right={
              <TextInput.Icon
                icon={passwordVisible ? 'eye-off' : 'eye'}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            buttonColor="#171717"
            textColor="#E2D7BD"
            style={styles.loginButton}
            contentStyle={styles.buttonContent}
          >
            Sign In
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.replace('/(tabs)/home')}
            textColor="#171717"
            style={styles.previewButton}
            contentStyle={styles.buttonContent}
          >
            Preview App (Development)
          </Button>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Link href="/(auth)/signup" style={styles.signupLink}>
              Sign Up
            </Link>
          </View>
        </View>

        <Text style={styles.footer}>Built for the love of the game.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2D7BD',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 42,
  },
  logo: {
    color: '#171717',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 4,
  },
  subtitle: {
    color: '#655D50',
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 8,
  },
  form: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  title: {
    color: '#171717',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#655D50',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 28,
  },
  input: {
    backgroundColor: '#F4EBDD',
    marginBottom: 16,
  },
  error: {
    color: '#A12626',
    fontSize: 13,
    marginBottom: 12,
  },
  loginButton: {
    borderRadius: 10,
    marginTop: 8,
  },
  previewButton: {
  borderColor: '#171717',
  borderRadius: 10,
  marginTop: 12,
  },
  buttonContent: {
    height: 48,
  },
  signupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    color: '#655D50',
  },
  signupLink: {
    color: '#171717',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  footer: {
    color: '#817663',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 42,
  },
});