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
    salary: number
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
        salary: salary
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
}
