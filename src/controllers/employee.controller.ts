import {authenticate} from '@loopback/authentication';
import {
  repository
} from '@loopback/repository';
import {
  del,
  get,
  param,
  patch, post, requestBody,
  response
} from '@loopback/rest';
import {UserData} from '../models/user-data.model';
import {UserDataRepository} from '../repositories';
import {professionUpdateRequestBody, roleGetterRequestBody} from '../requestSchemas/employee';

@authenticate('jwt')
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
  ): Promise<string | UserData> {
    return this.userDataRepository.addProfession(employeeProfession.employeeID, employeeProfession.professionID);
  }

  @del('/employee/profession')
  @response(200, {
    description: 'del profession',
  })
  async removeProfession(
    @requestBody(professionUpdateRequestBody) employeeProfession: {'employeeID': string, 'professionID': string},
  ): Promise<string> {
    return this.userDataRepository.removeProfession(employeeProfession.employeeID, employeeProfession.professionID);
  }

  @get('/employee/profession/${professionID}')
  @response(200, {
    description: 'get profession',
  })
  async getEmployeesByProfession(
    @param.path.string('professionID') professionID: string
  ): Promise<Array<object>> {
    return this.userDataRepository.getEmployeesByProfession(professionID);
  }

  @get('/employee')
  @response(200, {
    description: 'get employee list',
  })
  async getEmployeeList(
  ): Promise<Array<object>> {
    return this.userDataRepository.getEmployeeList();
  }

  @post('/employee/role')
  @response(200, {
    description: 'get employee role',
  })
  async getUserRole(
    @requestBody(roleGetterRequestBody) employee: {'userID': string},
  ): Promise<string> {
    return this.userDataRepository.getUserRole(employee.userID);
  }

  @post('/employee/id')
  @response(200, {
    description: 'get employee role',
  })
  async getEmployeeID(
    @requestBody(roleGetterRequestBody) employee: {'userID': string},
  ): Promise<string> {
    return this.userDataRepository.getEmployeeID(employee.userID);
  }
}
