import {Entity, model, property} from '@loopback/repository';

@model()
export class ErrorReport extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  errorID: string;

  @property({
    type: 'string',
  })
  fullname: string;

  @property({
    type: 'string',
  })
  phone: string;

  @property({
    type: 'string',
  })
  productID: string;

  @property({
    type: 'string',
  })
  desc: string;


  constructor(data?: Partial<ErrorReport>) {
    super(data);
  }
}

export interface ErrorReportRelations {
  // describe navigational properties here
}

export type ErrorReportWithRelations = ErrorReport & ErrorReportRelations;
