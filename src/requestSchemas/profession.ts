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

const updateProfessionSchema: SchemaObject = {
  type: 'object',
  required: ['professionName'],
  properties: {
    professionName: {
      type: 'string',
    },
  },
};

export const updateProfessionRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: updateProfessionSchema},
  },
};

const remainingProfessionsSchema: SchemaObject = {
  type: 'object',
  required: ['professionArray'],
  properties: {
    professionArray: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
  },
};

export const remainingProfessionsRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: remainingProfessionsSchema},
  },
};
