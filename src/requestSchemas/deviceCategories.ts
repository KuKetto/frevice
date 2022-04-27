import {SchemaObject} from '@loopback/rest';

export const maintanceReqSchema: SchemaObject = {
  type: 'object',
  required: ['requirementName', 'steps'],
  properties: {
    requirementName: {
      type: 'string',
    },
    steps: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
  }
};

const deviceCategorySchema: SchemaObject = {
  type: 'object',
  required: ['categoryName'],
  properties: {
    parentCategoryID: {
      type: 'string',
    },
    categoryName: {
      type: 'string',
    },
    defaultMaintanceSchedule: {
      type: 'number',
    },
    maintanceRequirements: {
      type: 'array',
      items: maintanceReqSchema
    },
  },
};

export const deviceCategoryRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: deviceCategorySchema},
  },
};


const testGenSchema: SchemaObject = {
  type: 'object',
  required: ['n'],
  properties: {
    n: {
      type: 'number',
    },
    parentID: {
      type: 'string',
    }
  },
};

export const testGenRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: testGenSchema},
  },
};

const deviceCategoryInsertSchema: SchemaObject = {
  type: 'object',
  required: ['categoryName'],
  properties: {
    whichChildID: {
      type: 'string',
    },
    categoryName: {
      type: 'string',
    },
    defaultMaintanceSchedule: {
      type: 'number',
    },
    maintanceRequirements: {
      type: 'array',
      items: maintanceReqSchema
    },
  },
};

export const deviceCategoryInsertRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: deviceCategoryInsertSchema},
  },
};

const deviceCategoryUpdateSchema: SchemaObject = {
  type: 'object',
  required: [],
  properties: {
    categoryName: {
      type: 'string',
    },
    defaultMaintanceSchedule: {
      type: 'number',
    },
    maintanceRequirements: {
      type: 'array',
      items: maintanceReqSchema
    },
  },
};

export const deviceCategoryUpdateRequestBody = {
  description: 'The input of new template',
  required: true,
  content: {
    'application/json': {schema: deviceCategoryUpdateSchema},
  },
};
