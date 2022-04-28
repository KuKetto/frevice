import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {RegisterOnHold, RegisterOnHoldRelations} from '../models';
import {genID} from '../services/id-gen';
import {genSalt} from '../services/salt_gen';

export class RegisterOnHoldRepository extends DefaultCrudRepository<
  RegisterOnHold,
  typeof RegisterOnHold.prototype.employeeID,
  RegisterOnHoldRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource
  ) {
    super(RegisterOnHold, dataSource);
  }

  async recordNewEmployee(
    email: string,
    employeeName: string,
    role: string,
    salary: number,
    phone: string,
    professions: Array<string>,
  ): Promise<string> {
    const code = genSalt();
    await this.create({
      employeeID: await this.genRID(),
      email: email,
      employeeName: employeeName,
      role: role,
      salary: salary,
      verificationCode: code,
      phone: phone,
      professions: professions
    });
    return code;
  }

  async verification(
    verificationCode: string,
  ): Promise<null | RegisterOnHold> {
    return this.findOne({where: {
      verificationCode: verificationCode
    }});
  }

  async genRID(): Promise<string> {
    const id = genID();
    return await this.checkRID(id) === false ? id : this.genRID();
  }

  async checkRID(id: string): Promise<RegisterOnHold | boolean> {
    try {
      return await this.findById(id);
    } catch (error) {
    if (error.code === 'ENTITY_NOT_FOUND') {
      return false;
    }
    throw error;
    }
  }
}

