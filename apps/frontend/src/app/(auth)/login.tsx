
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button, Text, TextInput } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { authClient } from '@/utils/auth-client';
import { Palette } from '@/constants/theme';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trimEnd(),
        password: password.trimEnd(),
        fetchOptions: { signal: AbortSignal.timeout(20000) },
      });

      if (result.error) {
        setError('Login failed. Please check your details.');
        return;
      }

      router.replace('/(tabs)/cards');
    } catch {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
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
          outlineColor={Palette.border}
          activeOutlineColor={Palette.gold}
          textColor={Palette.text}
          cursorColor={Palette.gold}
          selectionColor={Palette.gold}
          style={styles.input}
          theme={inputTheme}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          outlineColor={Palette.border}
          activeOutlineColor={Palette.gold}
          textColor={Palette.text}
          cursorColor={Palette.gold}
          selectionColor={Palette.gold}
          style={styles.input}
          theme={inputTheme}
          right={
            <TextInput.Icon
              icon={passwordVisible ? 'eye-off' : 'eye'}
              color={Palette.textSecondary}
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
          buttonColor={Palette.green}
          textColor={Palette.gold}
          style={styles.loginButton}
          contentStyle={styles.buttonContent}
        >
          Sign In
        </Button>

        <Button
          mode="outlined"
          onPress={() => router.replace('/(tabs)/cards')}
          textColor={Palette.text}
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
    </KeyboardAwareScrollView>
  );
}

const inputTheme = {
  colors: {
    onSurfaceVariant: Palette.textSecondary,
    primary: Palette.gold,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
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
    color: Palette.gold,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 4,
  },
  subtitle: {
    color: Palette.textSecondary,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 8,
  },
  form: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  title: {
    color: Palette.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: Palette.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 28,
  },
  input: {
    backgroundColor: Palette.surfaceElevated,
    marginBottom: 16,
  },
  error: {
    color: '#E58A80',
    fontSize: 13,
    marginBottom: 12,
  },
  loginButton: {
    borderRadius: 10,
    marginTop: 8,
  },
  previewButton: {
    borderColor: Palette.gold,
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
    color: Palette.textSecondary,
  },
  signupLink: {
    color: Palette.gold,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  footer: {
    color: Palette.textSecondary,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 42,
  },
});
