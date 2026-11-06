import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import * as SecureStore from 'expo-secure-store';
import { ENV } from '@/api/env';

export const authClient = createAuthClient({
  baseURL: `http://${ENV.EXPO_PUBLIC_API_URL}`, // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      // scheme: 'tcghub',
      storagePrefix: 'tcghub',
      storage: SecureStore,
      cookiePrefix: 'better-auth',
    }),
    inferAdditionalFields({
      user: {
        username: {
          type: 'string',
          required: true,
          input: true,
          unique: true,
        },
      },
    }),
  ],
});
