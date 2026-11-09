import { authClient } from '@/utils/auth-client';

export async function fetchTrade() {
  const cookies = await authClient.getCookie();
  const headers = {
    Cookie: cookies,
  };
  // TODO: this
  const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/api/v1/collection`, {
    method: 'GET',
    headers,
  });
  if (!response.ok) {
    console.error(response);
    throw new Error(`Failed to load chats (${response.status})`);
  }
}
