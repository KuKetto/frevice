import {Entity, model, property} from '@loopback/repository';

@model()
export class EmployeeData extends Entity {
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
  employeeName: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  professionKnownIDs: string[];

  @property({
    type: 'number',
  })
  salary: number;

  @property({
    type: 'number',
  })
  phone: number;

  constructor(data?: Partial<EmployeeData>) {
    super(data);
  }
}

@model()
export class UserData extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  userID: string;

  @property({
    type: 'string',
  })
  username: string;

  @property({
    type: 'string',
  })
  salt: string;

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  role: string;

  @property({
    type: 'object',
  })
  employeeData: EmployeeData;

  constructor(data?: Partial<UserData>) {
    super(data);
  }
}

export interface UserDataRelations {
  // describe navigational properties here
}

export type UserDataWithRelations = UserData & UserDataRelations;
