import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DeviceCategorysRepository} from '.';
import {MongoDbDataSource} from '../datasources';
import {Profession, ProfessionRelations} from '../models';
import {genID} from '../services/id-gen';

export class ProfessionRepository extends DefaultCrudRepository<
  Profession,
  typeof Profession.prototype.professionID,
  ProfessionRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Profession, dataSource);
  }

  async createNewProfession(
    professionName: string,
    selectedCategoryID: string,
    categoryRepo: DeviceCategorysRepository
  ): Promise<Profession | string> {
    const category = await categoryRepo.findOne({where: {
      categoryID: selectedCategoryID
    }});
    if (category === null) return 'Unexpected error: selected category not found';
    let categorysKnown = category.descendantsIDs;
    if (categorysKnown === undefined) categorysKnown = [];
    categorysKnown.push(selectedCategoryID);
    return this.create({
      professionID: await this.genPID(),
      professionName: professionName,
      categorysKnown: categorysKnown
    });
  }

  async genPID(): Promise<string> {
    const id = genID();
    return await this.checkPID(id) === false ? id : this.genPID();
  }

  async checkPID(id: string): Promise<Profession | boolean> {
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
