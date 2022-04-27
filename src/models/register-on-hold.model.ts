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
    type: 'number',
  })
  verificationCode: number;

  @property({
    type: 'array',
    itemType: 'string',
  })
  professions: string[];

  "Email": {
    datasource: "GmailDataSource"
  }

  constructor(data?: Partial<RegisterOnHold>) {
    super(data);
  }
}

export interface RegisterOnHoldRelations {
  // describe navigational properties here
}

export type RegisterOnHoldWithRelations = RegisterOnHold & RegisterOnHoldRelations;
