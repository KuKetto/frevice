import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {UserData, UserDataRelations} from '../models/user-data.model';

export class UserDataRepository extends DefaultCrudRepository<
  UserData,
  typeof UserData.prototype.userID,
  UserDataRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(UserData, dataSource);
  }

  async recordNewRegistration(
    username: string,
    userID: string,
    email: string,
    role: string,
    userSalt: string,
    employeeID: string,
    employeeName: string,
    professionKnownIDs: Array<string>,
    salary: number,
    phone: string
  ): Promise<UserData> {
    return this.create({
      username: username,
      userID: userID,
      email: email,
      role: role,
      salt: userSalt,
      employeeData: {
        employeeID: employeeID,
        employeeName: employeeName,
        professionKnownIDs: professionKnownIDs,
        salary: salary,
        phone: phone
      }
    });
  }

  async contructOnNewRegister(
    username: string | undefined,
    userID: string,
    email: string,
    role: string,
    userSalt: string
  ): Promise<UserData> {
    return this.create(
      new UserData({
        userID: userID,
        username: username,
        salt: userSalt,
        email: email,
        role: role
      })
    )
  }

  async addProfession(
    employeeID: string,
    professionID: string
  ): Promise<string> {
    const employee = await this.findOne({where: {
      employeeData: {
        regexp: employeeID
      }
    }});
    if (employee === null) return "Unexcepted error: not found employee by id";
    employee.employeeData.professionKnownIDs.push(professionID);
    return "success";
  }

  async removeProfession(
    employeeID: string,
    professionID: string
  ): Promise<string> {
    const employee = await this.findOne({where: {
      employeeData: {
        regexp: employeeID
      }
    }});
    if (employee === null) return "Unexcepted error: not found employee by id";
    employee.employeeData.professionKnownIDs.splice(employee.employeeData.professionKnownIDs.indexOf(professionID), 1);
    return "success";
  }

  async getEmployeesByProfession(
    professionID: string
  ): Promise<Array<object>> {
    const responseArray = [];
    const employees = await this.find({where: {
      employeeData: {
        regexp: professionID
      }
    }});
    for (const employee of employees) {
      responseArray.push({
        employeeName: employee.employeeData.employeeName,
        employeeID: employee.employeeData.employeeID
      })
    }
    return responseArray;
  }

  async getMail(
    username: string
  ): Promise<UserData | null> {
    return this.findOne({where: {username: username}});
  }

  async usernameUniqueTest(
    username: string
  ): Promise<UserData | null> {
    return this.findOne({where: {username: username}});
  }

  async getUserSalt(
    mail: string
  ): Promise<string | undefined> {
    const user = await this.findOne({where: {
      email: mail
    }})
    return user?.salt;
  }

  async getEmployeeList(): Promise<Array<object>> {
    const responseArray = [];
    const maintanceTechnicians = await this.find({where: {
      role: 'maintanceTechnician'
    }});
    for (const maintanceTechnician of maintanceTechnicians) {
      responseArray.push({
        employeeID: maintanceTechnician.employeeData.employeeID,
        employeeName: maintanceTechnician.employeeData.employeeName
      });
    }
    return responseArray;
  }

  async getUserRole(userID: string): Promise<string> {
    return (await this.findById(userID)).role;
  }
}
