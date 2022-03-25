import {SchemaObject} from '@loopback/rest';

const createDeviceSchema: SchemaObject = {
  type: 'object',
  required: ['deviceName', 'categoryID', 'productID', 'location', 'description'],
  properties: {
    deviceName: {
      type: 'string',
    },
    categoryID: {
      type: 'string',
    },
    productID: {
      type: 'string',
    },
    location: {
      type: 'string',
    },
    description: {
      type: 'string',
    }
  },
};

export const createDeviceRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: createDeviceSchema},
  },
};


const updateDeviceSchema: SchemaObject = {
  type: 'object',
  required: [],
  properties: {
    deviceName: {
      type: 'string',
    },
    categoryID: {
      type: 'string',
    },
    productID: {
      type: 'string',
    },
    location: {
      type: 'string',
    },
    description: {
      type: 'string',
    }
  },
};

export const updateDeviceRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: updateDeviceSchema},
  },
};
