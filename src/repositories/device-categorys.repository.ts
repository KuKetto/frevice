import {inject} from '@loopback/core';
import {DefaultCrudRepository, WhereBuilder} from '@loopback/repository';
import {ProfessionRepository} from '.';
import {MongoDbDataSource} from '../datasources';
import {DeviceCategorys, DeviceCategorysRelations, MaintanceRequirements} from '../models';
import {genID} from '../services/id-gen';

export class DeviceCategorysRepository extends DefaultCrudRepository<
  DeviceCategorys,
  typeof DeviceCategorys.prototype.categoryID,
  DeviceCategorysRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(DeviceCategorys, dataSource);
  }

  async newCategory(
    parentCategoryID: string,
    categoryName: string,
    defaultMaintanceSchedule: string,
    maintanceRequirements: Array<MaintanceRequirements>,
    professionRepo: ProfessionRepository
  ): Promise<string> {
    const newCategory = await this.create(new DeviceCategorys({
      categoryID: await this.genCID(),
      parentID: parentCategoryID,
      categoryName: categoryName,
      defaultMaintanceSchedule: defaultMaintanceSchedule,
      maintanceRequirements: maintanceRequirements
    }));
    if (newCategory.parentID !== undefined) {
      try {
        const whereBuilder = new WhereBuilder();
        const ancestorsOfParentFilter = whereBuilder
        .inq(parentCategoryID, DeviceCategorys.prototype.descendantsIDs)
        .build()
        const arrayOfAncestorsOfParent = await this.find({where: ancestorsOfParentFilter});
        for(const ancestor of arrayOfAncestorsOfParent) {
          ancestor.descendantsIDs.push(newCategory.categoryID);
          await this.replaceById(ancestor.categoryID, ancestor);
        }
      } catch (error) {
        if (error.code === 'ENTITY_NOT_FOUND') {
          //do nothing
          console.log('filter error or no record');
        }
      }

      const parent = await this.findById(parentCategoryID);
      if (parent.descendantsIDs === undefined) parent.descendantsIDs = [newCategory.categoryID];
      else parent.descendantsIDs.push(newCategory.categoryID);
      if (parent.childrenIDs === undefined) parent.childrenIDs = [newCategory.categoryID];
      else parent.childrenIDs.push(newCategory.categoryID);
      await this.replaceById(parent.categoryID, parent);
      if (parent.ancestorIDs === undefined) newCategory.ancestorIDs = [parent.categoryID];
      else {
        newCategory.ancestorIDs = parent.ancestorIDs;
        newCategory.ancestorIDs.push(parent.categoryID);
      }
      await this.replaceById(newCategory.categoryID, newCategory);


      const findProfessionsIfExist = await professionRepo.find({where: {
        categorysKnown: {
          regexp: parentCategoryID
        }
      }});
      for (const profession of findProfessionsIfExist) {
        profession.categorysKnown.push(newCategory.categoryID);
        professionRepo.replaceById(profession.professionID, profession)
      }
    }
    return 'success';
  }

  async getHierarchyTree(): Promise<Array<object>> {
    const roots = await this.find({where: {
      ancestorIDs: {
        exists: false
      }
    }});
    const responseArray: Array<object> = [];
    for(const root of roots) {
      const childrens = await this.buildTree(root);
      responseArray.push({
        categoryID: root.categoryID,
        categoryName: root.categoryName,
        childrens: childrens
      });
    }
    return responseArray;
  }

  async buildTree(
    root: DeviceCategorys
  ): Promise<Array<object>> {
    const descendantsOfRoot = await this.find({where: {
      ancestorIDs: {
        regexp: root.categoryID
      }
    }});
    const responseArray: Array<{
      categoryID: string,
      categoryName: string,
      childrens: []
    }> = [];
    return this.recursiveTreeBuilder(root.categoryID, descendantsOfRoot, responseArray);
  }

  async recursiveTreeBuilder(
    parentID: string,
    descendantsOfRoot: DeviceCategorys[],
    responseArray: Array<{
      categoryID: string,
      categoryName: string,
      childrens: Array<object>
    }>
  ): Promise<Array<object>> {
    for (const descendant of descendantsOfRoot) {
      if(descendant.parentID === parentID) {
        responseArray.push({
          categoryID: descendant.categoryID,
          categoryName: descendant.categoryName,
          childrens: []
        });
        //descendantsOfRoot.splice(descendantsOfRoot.indexOf(descendant), 1);
      }
    }
    if (descendantsOfRoot.length === 0) return responseArray;
    for(const foundChild of responseArray) {
      const newChildArray: Array<{
        categoryID: string,
        categoryName: string,
        childrens: Array<object>
      }> = [];
      await this.recursiveTreeBuilder(foundChild.categoryID, descendantsOfRoot, newChildArray);
      foundChild.childrens = newChildArray;
    }
    return responseArray;
  }

  async genCID(): Promise<string> {
    const id = genID();
    return await this.checkCID(id) === false ? id : this.genCID();
  }

  async checkCID(id: string): Promise<DeviceCategorys | boolean> {
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
