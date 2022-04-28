import {SchemaObject} from '@loopback/rest';

const recordNewEmployeeSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'employeeName', 'role', 'salary', 'phone', 'professions'],
  properties: {
    email: {
      type: 'string',
    },
    employeeName: {
      type: 'string',
    },
    role: {
      type: 'string',
    },
    salary: {
      type: 'number'
    },
    phone: {
      type: 'string'
    },
    professions: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
};

export const recordNewEmployeeRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: recordNewEmployeeSchema},
  },
};

const registerEmployeeSchema: SchemaObject = {
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

export const registerEmployeeRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: registerEmployeeSchema},
  },
};
