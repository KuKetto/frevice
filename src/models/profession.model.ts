import {Entity, model, property} from '@loopback/repository';

@model()
export class Profession extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  professionID: string;

  @property({
    type: 'string',
  })
  professionName: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  categorysKnown: string[];


  constructor(data?: Partial<Profession>) {
    super(data);
  }
}

export interface ProfessionRelations {
  // describe navigational properties here
}

export type ProfessionWithRelations = Profession & ProfessionRelations;
