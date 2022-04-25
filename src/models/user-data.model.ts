import {Entity, model, property} from '@loopback/repository';

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

  constructor(data?: Partial<UserData>) {
    super(data);
  }
}

export interface UserDataRelations {
  // describe navigational properties here
}

export type UserDataWithRelations = UserData & UserDataRelations;
