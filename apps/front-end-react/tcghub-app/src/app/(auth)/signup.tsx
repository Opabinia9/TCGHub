import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Link } from 'expo-router';

export default function Signup() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Create your account
      </Text>

      <Link href="/login" style={styles.link}>
        Back to Sign In
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2D7BD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    color: '#171717',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    color: '#655D50',
    marginBottom: 20,
  },
  link: {
    color: '#171717',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});