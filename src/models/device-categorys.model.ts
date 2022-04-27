import {Entity, model, property} from '@loopback/repository';

@model()
export class MaintanceRequirements extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  maintanceReqID: string;

  @property({
    type: 'string',
  })
  requirementName: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  steps: string[];

  constructor(data?: Partial<MaintanceRequirements>) {
    super(data);
  }
}

@model()
export class DeviceCategorys extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  categoryID: string;

  @property({
    type: 'string',
  })
  parentID: string;

  @property({
    type: 'array',
    itemType: 'string'
  })
  childrenIDs: string[];

  @property({
    type: 'array',
    itemType: 'string'
  })
  ancestorIDs: string[];

  @property({
    type: 'array',
    itemType: 'string'
  })
  descendantsIDs: string[];

  @property({
    type: 'string',
  })
  categoryName: string;

  @property({
    type: 'number',
  })
  defaultMaintanceSchedule: number;

  @property({
    type: 'array',
    itemType: 'object',
  })
  maintanceRequirements: MaintanceRequirements[];


  constructor(data?: Partial<DeviceCategorys>) {
    super(data);
  }
}

export interface DeviceCategorysRelations {
  // describe navigational properties here
}

export type DeviceCategorysWithRelations = DeviceCategorys & DeviceCategorysRelations;
