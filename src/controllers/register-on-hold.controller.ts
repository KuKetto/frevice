import {authenticate} from '@loopback/authentication';
import {UserRepository} from '@loopback/authentication-jwt';
import {
  repository
} from '@loopback/repository';
import {param, patch, post, requestBody, response} from '@loopback/rest';
import {hash} from 'bcryptjs';
import _ from 'lodash';
import {UserData} from '../models/user-data.model';
import {ProfessionRepository, RegisterOnHoldRepository, UserDataRepository} from '../repositories';
import {recordNewEmployeeRequestBody, registerEmployeeRequestBody} from '../requestSchemas/register-on-hold';
import {mailToken} from '../services/email.service';
import {genSalt} from '../services/salt_gen';

export class RegisterOnHoldController {
  constructor(
    @repository(RegisterOnHoldRepository) public registerOnHoldRepository : RegisterOnHoldRepository,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(UserDataRepository) public userDataRepository: UserDataRepository,
    @repository(ProfessionRepository) public professionRepository : ProfessionRepository,
  ) {}

  @authenticate('jwt')
  @post('/employee')
  @response(200, {
    description: 'Register',
  })
  async recordNewEmployee(
    @requestBody(recordNewEmployeeRequestBody) employee: {'email': string, 'employeeName': string, 'role': string, 'salary': number, 'phone': string, 'professions': Array<string>},
  ): Promise<string> {
    const code = await this.registerOnHoldRepository.recordNewEmployee(employee.email, employee.employeeName, employee.role, employee.salary, employee.phone, employee.professions);
    let roleOrProfessions = "";
    if (employee.role === "maintanceTechnician") {
      roleOrProfessions = "Karbantartó, végzettségei: ";
      for (const profession of employee.professions) {
        if (profession !== "") {
          const professionName = await this.professionRepository.findById(profession);
          roleOrProfessions += `${professionName.professionName}, `
        }
      }
    }
    else if (employee.role === "operator") roleOrProfessions = "Operátor";
    else if (employee.role === "deviceManager") roleOrProfessions = "Eszközkezelő";
    await mailToken(code, employee.email, employee.employeeName, employee.salary, employee.phone, roleOrProfessions.substring(0, roleOrProfessions.length - 2));
    return `/employee/$${code}`
  }

  @patch('/employee/register/${token}')
  @response(200, {
    description: 'Register',
  })
  async checkToken(
    @param.path.string('token') token: string
  ): Promise<object> {
    const verification = await this.registerOnHoldRepository.verification(token);
    return verification === null ? {
      tokenValid: false
    } : {
      tokenValid: true,
      email: verification.email
    };
  }

  @post('/employee/register/${token}')
  @response(200, {
    description: 'Register',
  })
  async register(
    @requestBody(registerEmployeeRequestBody) employee: {'email': string, 'username': string, 'password': string},
    @param.path.string('token') token: string
  ): Promise<string | UserData> {
    const verification = await this.registerOnHoldRepository.verification(token);
    if (verification === null) return "TokenAuth error";
    const uniqueUsernameTest = await this.userDataRepository.usernameUniqueTest(employee.username);
    if (uniqueUsernameTest !== null) return 'This username is already in use';
    const newSalt = genSalt();
    const password = await hash(employee.password + newSalt, 0);
    const savedUser = await this.userRepository.create(
      _.omit(employee, 'password'),
    );
    await this.userRepository.userCredentials(savedUser.id).create({password});
    await this.registerOnHoldRepository.deleteById(verification.employeeID);
    return this.userDataRepository.recordNewRegistration(employee.username, savedUser.id, employee.email, verification.role, newSalt, verification.employeeID, verification.employeeName, verification.professions, verification.salary, verification.phone)
  }
}
