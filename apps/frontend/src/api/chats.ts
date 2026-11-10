import { authClient } from '@/utils/auth-client';
import { User } from './userTypes';
export interface Chat {
  id: string;
  name?: string;
  type: 'DIRECT' | 'GROUP' | 'TRADE';
  directKey?: string;
  sellerId?: string;
  cardId?: string;
  createdAt: Date;
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

  const chats: { error?: string; success?: string; chats: Array<Chat> } = await response.json();
  if (chats.error) {
    throw new Error(chats.error);
  }

  const chatsWithMessages = await Promise.all(
    chats.chats.map(async (chat) => {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_URL}/api/v1/chats/${chat.id}/messages`,
        {
          method: 'GET',
          headers,
        },
      );
      if (!response.ok) {
        throw new Error(`Failed to load chats (${response.status})`);
      }
      const payload: {
        error?: string;
        success?: string;
        messages: Array<Message>;
      } = await response.json();
      return {
        ...chat,
        messages: payload.messages,
      };
    }),
  );
  return chatsWithMessages.sort((chatA, chatB) => {
    return (
      new Date(chatB.messages.at(-1)?.createdAt ?? chatB.createdAt).getTime() -
      new Date(chatA.messages.at(-1)?.createdAt ?? chatA.createdAt).getTime()
    );
  });
}

export async function fetchChat(chatId: string) {
  const cookies = await authClient.getCookie();
  const headers = {
    Cookie: cookies,
  };
  const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/api/v1/chats/${chatId}`, {
    method: 'GET',
    headers,
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    console.error(response);
    throw new Error(`Failed to load chats (${response.status})`);
  }

  const chat: Chat & { error?: string } = await response.json();
  if (chat.error) {
    throw new Error(chat.error);
  }

  return chat;
}

export async function fetchMessages(chatId: string) {
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

  const messages: {
    error?: string;
    success?: string;
    messages: Array<Message>;
  } = await response.json();
  if (messages.error) {
    throw new Error(messages.error);
  }

  return messages.messages;
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
