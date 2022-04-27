import {Entity, model, property} from '@loopback/repository';

@model()
export class RegisterOnHold extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  employeeID: string;

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  employeeName: string;

  @property({
    type: 'string',
  })
  role: string;

  @property({
    type: 'number',
  })
  salary: number;

  @property({
    type: 'string',
  })
  verificationCode: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  professions: string[];

  @property({
    type: 'number',
  })
  phone: number;

  constructor(data?: Partial<RegisterOnHold>) {
    super(data);
  }
}

export interface RegisterOnHoldRelations {
  // describe navigational properties here
}

export type RegisterOnHoldWithRelations = RegisterOnHold & RegisterOnHoldRelations;
