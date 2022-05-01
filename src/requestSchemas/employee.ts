import {SchemaObject} from '@loopback/rest';

const professionUpdateSchema: SchemaObject = {
  type: 'object',
  required: ['employeeID', 'professionID'],
  properties: {
    employeeID: {
      type: 'string',
    },
    professionID: {
      type: 'string',
    },
  },
};

export const professionUpdateRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: professionUpdateSchema},
  },
};

const roleGetterSchema: SchemaObject = {
  type: 'object',
  required: ['userID'],
  properties: {
    userID: {
      type: 'string',
    },
  },
};

export const roleGetterRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: roleGetterSchema},
  },
};
