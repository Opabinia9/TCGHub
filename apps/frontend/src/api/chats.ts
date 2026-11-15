import { authClient } from '@/utils/auth-client';
import { User } from './userTypes';
export interface Chat {
  id: string;
  name?: string;
  type: 'DIRECT' | 'GROUP' | 'TRADE';
  directKey?: string;
  sellerId?: string;
  cardId?: string;
  createdAt: string;
  members: Array<User>;
  lastReadMessageId: string;
  joinedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  createdAt: string;
  body: string;
}

export type ChatWithMessages = Chat & { messages: Array<Message> };

export async function fetchChats() {
  const cookies = await authClient.getCookie();
  const headers = {
    Cookie: cookies,
  };
  const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/api/v1/chats`, {
    method: 'GET',
    headers,
  });
  if (!response.ok) {
    throw new Error(`Failed to load chats (${response.status})`);
  }
  const chats: {
    error?: string;
    success?: string;
    chats: Array<{
      id: string;
      name?: string;
      type: 'DIRECT' | 'GROUP' | 'TRADE';
      directKey?: string;
      sellerId?: string;
      cardId?: string;
      members: Array<string>;
      createdAt: string;
      lastReadMessageId: string;
      joinedAt: string;
    }>;
  } = await response.json();
  if (chats.error) {
    throw new Error(chats.error);
  }
  return chats.chats;
}

export async function fetchChat(chatId: string) {
  const cookies = await authClient.getCookie();
  const headers = {
    Cookie: cookies,
  };
  const response = await fetch(
    `http://${process.env.EXPO_PUBLIC_API_URL}/api/v1/chats/${chatId}/messages`,
    {
      method: 'GET',
      headers,
    },
  );
  if (!response.ok) {
    console.error(response);
    throw new Error(`Failed to load chats (${response.status})`);
  }
  const chatWithMessages: {
    error?: string;
    success?: string;
    chat: Chat & { messages: Array<Message> };
  } = await response.json();
  if (chatWithMessages.error) {
    throw new Error(chatWithMessages.error);
  }
  return chatWithMessages.chat;
}

export async function sendMessage(chatId: string, body: string) {
  const cookies = await authClient.getCookie();
  const headers = {
    Cookie: cookies,
    'Content-Type': 'application/json',
  };
  const response = await fetch(
    `http://${process.env.EXPO_PUBLIC_API_URL}/api/v1/chats/${chatId}/messages`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ body }),
    },
  );
  if (!response.ok) {
    console.error(response);
    throw new Error(`Failed to load chats (${response.status})`);
  }
  const payload: { success: string; message: Message } = await response.json();
  return payload.message;
}

export async function updateLastReadMessage(chatId: string, messageId: string) {
  const cookies = await authClient.getCookie();
  const headers = {
    Cookie: cookies,
    'Content-Type': 'application/json',
  };
  const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/api/v1/chats/${chatId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ messageId }),
  });
  if (!response.ok) {
    console.error(response);
    throw new Error(`Failed to load chats (${response.status})`);
  }
}

export async function createTradeChat(sellerId: string, cardId: string) {
  const cookies = await authClient.getCookie();
  const headers = {
    Cookie: cookies,
    'Content-Type': 'application/json',
  };
  const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/api/v1/chats`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ type: 'TRADE', sellerId, cardId }),
  });
  if (!response.ok) {
    throw new Error(`Failed to load chats (${response.status})`);
  }
  const payload: { success: string; chatId: string } = await response.json();
  return payload.chatId;
}
