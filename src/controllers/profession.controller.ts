import {
  repository
} from '@loopback/repository';
import {
  del,
  get, param, patch, post, requestBody,
  response
} from '@loopback/rest';
import {Profession} from '../models';
import {DeviceCategorysRepository, ProfessionRepository} from '../repositories';
import {newProfessionRequestBody, updateProfessionRequestBody} from '../requestSchemas/profession';

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

  @get('/professions/${professionID}')
  @response(200, {
    description: 'Profession model instance',
  })
  async getProfessionInfo(
    @param.path.string('professionID') professionID: typeof Profession.prototype.professionID
  ): Promise<object> {
    return this.professionRepository.getProfessionInfo(professionID, this.deviceCategorysRepository);
  }

  @patch('/professions/${professionID}')
  @response(200, {
    description: 'Profession model instance',
  })
  async updateProfession(
    @requestBody(updateProfessionRequestBody) updateProfession: {'professionName': string},
    @param.path.string('professionID') professionID: typeof Profession.prototype.professionID
  ): Promise<Profession | string> {
    return this.professionRepository.updateProfession(professionID, updateProfession.professionName);
  }

  @del('/professions/${professionID}')
  @response(200, {
    description: 'Profession model instance',
  })
  async deleteProfession(
    @param.path.string('professionID') professionID: typeof Profession.prototype.professionID
  ): Promise<string> {
    return this.professionRepository.deleteProfession(professionID);
  }
}
