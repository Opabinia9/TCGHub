export interface authLoginBody {
  email: string,
  password: string,
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
      password: { type: 'string' }
    },
  }
}
