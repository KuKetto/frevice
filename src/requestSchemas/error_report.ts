import {SchemaObject} from '@loopback/rest';

const errorReportSchema: SchemaObject = {
  type: 'object',
  required: ['fullname', 'phone', 'productID', 'desc'],
  properties: {
    fullname: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    productID: {
      type: 'string',
    },
    desc: {
      type: 'string',
    },
  },
};

export const errorReportRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: errorReportSchema},
  },
};
