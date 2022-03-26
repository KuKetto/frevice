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

  async updateProfession(
    professionID: string,
    professionName: string,
  ): Promise<Profession | string> {
    try {
      const profession = await this.findById(professionID);
      profession.professionName = professionName;
      await this.replaceById(professionID, profession);
      return profession;
    } catch (error) {
    if (error.code === 'ENTITY_NOT_FOUND') {
      return 'Unexpected error: Profession not found by ID';
    }
    throw error;
    }
  }

  async deleteProfession(
    professionID: string
  ): Promise<string> {
    try {
      const profession = await this.findById(professionID);
      await this.delete(profession);
      return `Succesfully deleted ${profession.professionName} profession`;
    } catch (error) {
    if (error.code === 'ENTITY_NOT_FOUND') {
      return 'Unexpected error: Profession not found by ID';
    }
    throw error;
    }
  }

  async getProfessionInfo(
    professionID: string,
    category: DeviceCategorysRepository
  ): Promise<object> {
    try {
      const profession = await this.findById(professionID);
      const responseArray: string[] = [];
      const response = {
        professionName: profession.professionName,
        categoriesKnown: responseArray
      }
      for (const deviceCategory of profession.categorysKnown) {
        try {
          const currentCategory = await category.findById(deviceCategory);
          response.categoriesKnown.push(currentCategory.categoryName);
        } catch (error) {
        if (error.code === 'ENTITY_NOT_FOUND') {
          return {Error: 'Category not found by ID'};
        }
        throw error;
        }
      }
      return response;
    } catch (error) {
    if (error.code === 'ENTITY_NOT_FOUND') {
      return {Error: 'Profession not found by ID'};
    }
    throw error;
    }
  }

  async getProfessions(): Promise<Array<object>> {
    const professions = await this.find();
    const responseArray: Array<{
      professionID: string,
      professionName: string
    }> = [];
    for (const profession of professions) responseArray.push({
      professionID: profession.professionID,
      professionName: profession.professionName
    });
    return responseArray;
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
