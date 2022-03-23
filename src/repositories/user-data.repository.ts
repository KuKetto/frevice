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

  async contructOnNewRegister(
    username: string | undefined,
    userID: string,
    email: string
  ): Promise<UserData> {
    return this.create(
      new UserData({
        userID: userID,
        username: username,
        email: email,
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
}
