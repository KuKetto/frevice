import {
  repository
} from '@loopback/repository';
import {
  get, post, requestBody,
  response
} from '@loopback/rest';
import {Profession} from '../models';
import {DeviceCategorysRepository, ProfessionRepository} from '../repositories';
import {newProfessionRequestBody} from '../requestSchemas/profession';

export class ProfessionController {
  constructor(
    @repository(ProfessionRepository)
    public professionRepository : ProfessionRepository,
    @repository(DeviceCategorysRepository)
    public deviceCategorysRepository : DeviceCategorysRepository,
  ) {}

  @post('/professions')
  @response(200, {
    description: 'Profession model instance',
  })
  async create(
    @requestBody(newProfessionRequestBody) newProfession: {'professionName': string, 'selectedCategoryID': string}
  ): Promise<Profession | string> {
    return this.professionRepository.createNewProfession(newProfession.professionName, newProfession.selectedCategoryID, this.deviceCategorysRepository);
  }

  @get('/professions')
  @response(200, {
    description: 'Profession model instance',
  })
  async getProfessions(): Promise<Profession[]> {
    return this.professionRepository.find();
  }
}
