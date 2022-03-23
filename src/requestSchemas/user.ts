import {SchemaObject} from '@loopback/rest';

const registerSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'username', 'password'],
  properties: {
    email: {
      type: 'string',
    },
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
};

export const registerRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: registerSchema},
  },
};

const loginSchema: SchemaObject = {
  type: 'object',
  required: ['password'],
  properties: {
    email: {
      type: 'string',
    },
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
};

export const loginRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: loginSchema},
  },
};
