import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {RegisterOnHold, RegisterOnHoldRelations} from '../models';
import {genID} from '../services/id-gen';

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
    professions: Array<string>,
  ): Promise<number> {
    const code = Math.floor(Math.random() * ((999999) - 100000 + 1) + 100000);
    await this.create({
      employeeID: await this.genRID(),
      email: email,
      employeeName: employeeName,
      role: role,
      salary: salary,
      verificationCode: code,
      professions: professions
    });
    return code;
  }

  async verification(
    email: string,
    verificationCode: number,
  ): Promise<string | RegisterOnHold> {
    const record = await this.findOne({where: {
      email: email
    }});
    if (record === null) return "Hiba: nincs folyamatban lévő regisztráció a megadott e-mail címmel!";
    if (record?.verificationCode !== verificationCode) return "Hiba: nem megfelelő megerősítési kód!";
    return record;
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

