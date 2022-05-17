import {SchemaObject} from '@loopback/rest';

const createTaskSchema: SchemaObject = {
  type: 'object',
  required: ['employeeID', 'deviceID', 'type', 'date'],
  properties: {
    employeeID: {
      type: 'string',
    },
    deviceID: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    date: {
      type: 'number',
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
  required: ['taskID', 'status', 'reason'],
  properties: {
    taskID: {
      type: 'string',
    },
    status: {
      type: 'string',
    },
    reason: {
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
