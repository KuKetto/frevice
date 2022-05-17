import {Entity, model, property} from '@loopback/repository';

@model()
export class Task extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  taskID: string;

  @property({
    type: 'string',
  })
  employeeID: string;

  @property({
    type: 'string',
  })
  status: string;

  @property({
    type: 'string',
  })
  deviceID: string;

  @property({
    type: 'string',
  })
  type: string;

  @property({
    type: 'string',
  })
  reason: string;

  @property({
    type: 'date',
  })
  date: Date;


  constructor(data?: Partial<Task>) {
    super(data);
  }
}

export interface TaskRelations {
  // describe navigational properties here
}

export type TaskWithRelations = Task & TaskRelations;
