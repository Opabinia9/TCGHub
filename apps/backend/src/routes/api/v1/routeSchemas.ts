import { ChatType } from '@prisma/client';

export interface AuthLoginBody {
  email: string;
  password: string;
}
export const authLoginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    additionalProperties: false,
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
      password: { type: 'string' },
    },
  },
};

export interface AuthSignupBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  username: string;
}
export const authSignupSchema = {
  body: {
    type: 'object',
    required: ['first_name', 'last_name', 'email', 'password', 'username'],
    additionalProperties: false,
    properties: {
      first_name: { type: 'string' },
      last_name: { type: 'string' },
      email: {
        type: 'string',
        format: 'email',
      },
      password: { type: 'string' },
      username: { type: 'string' },
    },
  },
};

export interface ChatParamsInterface {
  chatId: string;
}
export const chatParamsSchema = {
  type: 'object',
  properties: {
    chatId: { type: 'string' },
  },
};

export interface ChatPostBodyInterface {
  body: string;
}

export const chatPostBodySchema = {
  type: 'object',
  required: ['body'],
  additionalProperties: false,
  properties: {
    body: { type: 'string' },
  },
};

export const chatCreationBodySchema = {
  type: 'object',
  required: ['title', 'type', 'members'],
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    type: { type: 'string', enum: Object.values(ChatType) },

    members: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
};
