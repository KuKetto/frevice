import {
  repository
} from '@loopback/repository';
import {
  del,
  get,
  param,
  patch, requestBody,
  response
} from '@loopback/rest';
import {UserDataRepository} from '../repositories';
import {professionUpdateRequestBody} from '../requestSchemas/employee';

export class EmployeeController {
  constructor(
    @repository(UserDataRepository)
    public userDataRepository : UserDataRepository,
  ) {}

  @patch('/employee/profession')
  @response(200, {
    description: 'add profession',
  })
  async addProfession(
    @requestBody(professionUpdateRequestBody) employeeProfession: {'employeeID': string, 'professionID': string},
  ): Promise<string> {
    return this.userDataRepository.addProfession(employeeProfession.employeeID, employeeProfession.professionID);
  }

  @del('/employee/profession')
  @response(200, {
    description: 'add profession',
  })
  async removeProfession(
    @requestBody(professionUpdateRequestBody) employeeProfession: {'employeeID': string, 'professionID': string},
  ): Promise<string> {
    return this.userDataRepository.removeProfession(employeeProfession.employeeID, employeeProfession.professionID);
  }

  @get('/employee/profession/${professionID}')
  @response(200, {
    description: 'add profession',
  })
  async getEmployeesByProfession(
    @param.path.string('professionID') professionID: string
  ): Promise<Array<object>> {
    return this.userDataRepository.getEmployeesByProfession(professionID);
  }
}
