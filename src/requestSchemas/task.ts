import {SchemaObject} from '@loopback/rest';

const createTaskSchema: SchemaObject = {
  type: 'object',
  required: ['employeeID', 'deviceID', 'type', 'date'],
  employeeID: {
    email: {
      type: 'string',
    },
    deviceID: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    date: {
      type: 'date',
    },
  },
};

export const createTaskRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: createTaskSchema},
  },
};

const changeStatusSchema: SchemaObject = {
  type: 'object',
  required: ['employeeID', 'status'],
  employeeID: {
    email: {
      type: 'string',
    },
    status: {
      type: 'string',
    },
  },
};

export const changeStatusRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: changeStatusSchema},
  },
};
