
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button, Text, TextInput } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { authClient } from '@/utils/auth-client';
import { Palette } from '@/constants/theme';

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        username: username.trimEnd(),
        email: email.trimEnd(),
        name: name.trimEnd(),
        password: password.trimEnd(),
      });

      if (result.error) {
        setError('Account creation failed. Check your details or try another username or email.');
        return;
      }

      setSuccess(true);
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
          Create your account
        </Text>

        <Text style={styles.description}>
          Join other Planeswalkers and find your next trade.
        </Text>

        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          autoCapitalize="words"
          outlineColor={Palette.border}
          activeOutlineColor={Palette.gold}
          textColor={Palette.text}
          cursorColor={Palette.gold}
          selectionColor={Palette.gold}
          style={styles.input}
          theme={inputTheme}
        />

        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
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

        {success ? (
          <Text style={styles.success}>
            Account created successfully! You can now sign in.
          </Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSignup}
          loading={loading}
          disabled={loading}
          buttonColor={Palette.green}
          textColor={Palette.gold}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Create Account
        </Button>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Link href="/(auth)/login" style={styles.loginLink}>
            Sign In
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
    marginBottom: 32,
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
    marginBottom: 24,
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
  success: {
    color: Palette.greenAccent,
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    borderRadius: 10,
    marginTop: 8,
  },
  buttonContent: {
    height: 48,
  },
  loginContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: Palette.textSecondary,
  },
  loginLink: {
    color: Palette.gold,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  footer: {
    color: Palette.textSecondary,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 36,
  },
});
