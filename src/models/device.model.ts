import {Entity, model, property} from '@loopback/repository';

@model()
export class Device extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  deviceID: string;

  @property({
    type: 'string',
  })
  deviceName: string;

  @property({
    type: 'string',
  })
  categoryID: string;

  @property({
    type: 'array',
    itemType: 'string'
  })
  professionIDs: string[];

  @property({
    type: 'string',
  })
  productID: string;

  @property({
    type: 'string',
  })
  location: string;

  @property({
    type: 'string',
  })
  description: string;


  constructor(data?: Partial<Device>) {
    super(data);
  }
}

export interface DeviceRelations {
  // describe navigational properties here
}

export type DeviceWithRelations = Device & DeviceRelations;
