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

export const cardIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: { id: { type: 'string', minLength: 1 } },
};

export const cardSearchQuerySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    set: { type: 'string', minLength: 1 },
    rarity: { type: 'string', minLength: 1 },
    colors: { type: 'string', minLength: 1 },
    oracleText: { type: 'string', minLength: 1 },
    typeLine: { type: 'string', minLength: 1 },
    manaCost: { type: 'string', minLength: 1 },
    cmc: { type: 'number', minimum: 0 },
    releasedAt: { type: 'string', minLength: 1 },
    prices: { type: 'number', minimum: 0 },
    legalities: { type: 'string', minLength: 1 },
    colorIdentity: { type: 'string', minLength: 1 },
    page: { type: 'integer', minimum: 1, default: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
  },
};

export interface collectionBodyInterface {
  card_id: string;
}
