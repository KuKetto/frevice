import {SchemaObject} from '@loopback/rest';

const newProfessionSchema: SchemaObject = {
  type: 'object',
  required: ['professionName', 'selectedCategoryID'],
  properties: {
    professionName: {
      type: 'string',
    },
    selectedCategoryID: {
      type: 'string',
    }
  },
};

export const newProfessionRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: newProfessionSchema},
  },
};
