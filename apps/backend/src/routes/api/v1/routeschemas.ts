export interface authLoginBody {
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

export interface authSignupBody {
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
