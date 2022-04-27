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
    defaultMaintanceSchedule: number,
    expectedMaintanceTimeInMinutes: number,
    maintanceRequirements: Array<MaintanceRequirements>,
    professionRepo: ProfessionRepository
  ): Promise<string> {
    let maintanceSchedule = defaultMaintanceSchedule;
    let maintanceTimeInMinutes = expectedMaintanceTimeInMinutes;
    if (maintanceSchedule === undefined) {
      if (parentCategoryID === undefined) return 'Error: defaultMaintanceSchedule was given and cannot fetch it from undefined parentID';
      else {maintanceSchedule = await this.getMaintanceScheduleFromParent(parentCategoryID);}
      if (maintanceSchedule === -1) return 'Unexpected error: parent category not found'
    }
    if (maintanceTimeInMinutes === undefined) {
      if (parentCategoryID === undefined) return 'Error: expectedMaintanceTimeInMinutes was given and cannot fetch it from undefined parentID';
      else {maintanceTimeInMinutes = await this.getExpectedMaintanceTimeInMinutesFromParent(parentCategoryID);}
      if (maintanceTimeInMinutes === -1) return 'Unexpected error: parent category not found'
    }
    const newCategory = await this.create(new DeviceCategorys({
      categoryID: await this.genCID(),
      parentID: parentCategoryID,
      categoryName: categoryName,
      defaultMaintanceSchedule: maintanceSchedule,
      expectedMaintanceTimeInMinutes: maintanceTimeInMinutes,
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
        await professionRepo.replaceById(profession.professionID, profession)
      }
    }
    return 'success';
  }

  async updadeCategory(
    categoryID: string,
    categoryName: string,
    defaultMaintanceSchedule: number,
    expectedMaintanceTimeInMinutes: number,
    maintanceRequirements: Array<MaintanceRequirements>,
  ): Promise<DeviceCategorys | string> {
    try {
      const category = await this.findById(categoryID);
      if (categoryName !== undefined) category.categoryName = categoryName;
      if (defaultMaintanceSchedule !== undefined) category.defaultMaintanceSchedule = defaultMaintanceSchedule;
      if (expectedMaintanceTimeInMinutes !== undefined) category.expectedMaintanceTimeInMinutes = expectedMaintanceTimeInMinutes;
      if (maintanceRequirements !== undefined) category.maintanceRequirements = maintanceRequirements;
      await this.replaceById(categoryID, category);
      return category;
    } catch (error) {
    if (error.code === 'ENTITY_NOT_FOUND') {
      return 'Unexpected error: Category not found by ID';
    }
    throw error;
    }
  }

  async getMaintanceScheduleFromParent(
    parentID: string
  ): Promise<number> {
    try {
      const parent = await this.findById(parentID);
      return parent.defaultMaintanceSchedule;
    } catch (error) {
    if (error.code === 'ENTITY_NOT_FOUND') {
      return -1;
    }
    throw error;
    }
  }

  async getExpectedMaintanceTimeInMinutesFromParent(
    parentID: string
  ): Promise<number> {
    try {
      const parent = await this.findById(parentID);
      return parent.expectedMaintanceTimeInMinutes;
    } catch (error) {
    if (error.code === 'ENTITY_NOT_FOUND') {
      return -1;
    }
    throw error;
    }
  }

  async getByID(
    categoryID: string
  ): Promise<object> {
    try {
      const category = await this.findById(categoryID);
      return {
        categoryName: category.categoryName,
        defaultMaintanceSchedule: category.defaultMaintanceSchedule,
        expectedMaintanceTimeInMinutes: category.expectedMaintanceTimeInMinutes,
        maintanceRequirements: category.maintanceRequirements
      }
    } catch (error) {
    if (error.code === 'ENTITY_NOT_FOUND') {
      return {error: 'Unexpected error: Category not found by ID'};
    }
    throw error;
    }
  }

  async getRoots(): Promise<Array<object>> {
    const roots = await this.find({where: {
      ancestorIDs: {
        exists: false
      }
    }});
    const responseArray: Array<object> = [];
    for(const root of roots) {
      responseArray.push({
        categoryID: root.categoryID,
        categoryName: root.categoryName,
        defaultMaintanceSchedule: root.defaultMaintanceSchedule,
        expectedMaintanceTimeInMinutes: root.expectedMaintanceTimeInMinutes
      });
    }
    return responseArray;
  }

  async getChildOfParent(
    categoryID: typeof DeviceCategorys.prototype.categoryID
  ): Promise<Array<object>> {
    const parent = await this.findById(categoryID);
    const responseArray: Array<object> = [];
    for (const child of parent.childrenIDs) {
      const currentChild = await this.findById(child);
      responseArray.push({
        categoryID: child,
        categoryName: currentChild.categoryName,
        defaultMaintanceSchedule: currentChild.defaultMaintanceSchedule,
        expectedMaintanceTimeInMinutes: currentChild.expectedMaintanceTimeInMinutes
      })
    }
    return responseArray;
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

  async insertIntoTree(
    parentCategoryID: string,
    whichChildID: string,
    categoryName: string,
    defaultMaintanceSchedule: number,
    expectedMaintanceTimeInMinutes: number,
    maintanceRequirements: Array<MaintanceRequirements>,
    professionRepo: ProfessionRepository
  ): Promise<DeviceCategorys | string> {
    try {
      const parent = await this.findById(parentCategoryID);
      const whichChildToLowerInTree = await this.findById(whichChildID);
      const newCategoryChildrenArray = [whichChildID];
      const newCategoryDescendantIDArray = whichChildToLowerInTree.descendantsIDs;
      newCategoryDescendantIDArray.push(whichChildID);
      const newCategory = await this.create(new DeviceCategorys({
        categoryID: await this.genCID(),
        parentID: parentCategoryID,
        ancestorIDs: whichChildToLowerInTree.ancestorIDs,
        descendantsIDs: newCategoryDescendantIDArray,
        childrenIDs: newCategoryChildrenArray,
        categoryName: categoryName,
        defaultMaintanceSchedule: defaultMaintanceSchedule,
        expectedMaintanceTimeInMinutes: expectedMaintanceTimeInMinutes,
        maintanceRequirements: maintanceRequirements
      }));
      parent.childrenIDs[parent.childrenIDs.indexOf(whichChildID)] = newCategory.categoryID;
      parent.descendantsIDs.push(newCategory.categoryID);
      await this.replaceById(parentCategoryID, parent);
      whichChildToLowerInTree.parentID = newCategory.categoryID;
      whichChildToLowerInTree.ancestorIDs.push(newCategory.categoryID);
      await this.replaceById(whichChildID, whichChildToLowerInTree);
      const findProfessionsIfExist = await professionRepo.find({where: {
        categorysKnown: {
          regexp: parentCategoryID
        }
      }});
      for (const profession of findProfessionsIfExist) {
        profession.categorysKnown.push(newCategory.categoryID);
        await professionRepo.replaceById(profession.professionID, profession)
      }
      return newCategory;
    } catch (error) {
    if (error.code === 'ENTITY_NOT_FOUND') {
      return 'Unexpected error: Category by id not found';
    }
    throw error;
    }
  }

  async deleteFromTree(
    categoryID: string,
    profession: ProfessionRepository
  ): Promise<string> {
    try {
      const toDeleteCategory = await this.findById(categoryID);
      if (toDeleteCategory.parentID === undefined) {
        for (const childOfRoot of toDeleteCategory.childrenIDs) {
          try {
            const child = await this.findById(childOfRoot);
            await this.delete(child);
            await this.create({
              categoryID: child.categoryID,
              categoryName: child.categoryName,
              childrenIDs: child.childrenIDs,
              descendantsIDs: child.descendantsIDs,
              maintanceRequirements: child.maintanceRequirements,
              defaultMaintanceSchedule: child.defaultMaintanceSchedule,
              expectedMaintanceTimeInMinutes: child.expectedMaintanceTimeInMinutes
            });
          } catch (error) {
          if (error.code === 'ENTITY_NOT_FOUND') {
            return 'Unexpected error: category not found by ID';
          }
          throw error;
          }
        }
        const hasDeletedIDInAncestors = await this.find({where:{
          ancestorIDs: {
            regexp: categoryID
          }
        }});
        if (hasDeletedIDInAncestors.length > 0) {
          for (const ancestor of hasDeletedIDInAncestors) {
            ancestor.ancestorIDs.splice(ancestor.ancestorIDs.indexOf(categoryID), 1);
            await this.replaceById(ancestor.categoryID, ancestor);
          }
        }
        await this.delete(toDeleteCategory);
        await this.updateProfessionOnCategoryDeleted(profession, categoryID);
        return `Deleted root with ID: ${categoryID}`;
      }
      if (toDeleteCategory.childrenIDs === undefined) {
        for (const ancestor of toDeleteCategory.ancestorIDs) {
          try {
            const currentAncestor = await this.findById(ancestor);
            if (currentAncestor.categoryID === toDeleteCategory.parentID) currentAncestor.childrenIDs.splice(currentAncestor.childrenIDs.indexOf(categoryID), 1);
            currentAncestor.descendantsIDs.splice(currentAncestor.descendantsIDs.indexOf(categoryID, 1));
            await this.replaceById(ancestor, currentAncestor);
          } catch (error) {
          if (error.code === 'ENTITY_NOT_FOUND') {
            return 'Unexpected error: category not found by ID';
          }
          throw error;
          }
        }
        await this.delete(toDeleteCategory);
        await this.updateProfessionOnCategoryDeleted(profession, categoryID);
        return `Deleted leaf with ID: ${categoryID}`;
      }
      for (const ancestor of toDeleteCategory.ancestorIDs) {
        try {
          const currentAncestor = await this.findById(ancestor);
          if (currentAncestor.categoryID === toDeleteCategory.parentID) {
            currentAncestor.childrenIDs.splice(currentAncestor.childrenIDs.indexOf(categoryID), 1)
            for (const child of toDeleteCategory.childrenIDs) currentAncestor.childrenIDs.push(child);
          };
          currentAncestor.descendantsIDs.splice(currentAncestor.descendantsIDs.indexOf(categoryID, 1));
          await this.replaceById(ancestor, currentAncestor);
        } catch (error) {
        if (error.code === 'ENTITY_NOT_FOUND') {
          return 'Unexpected error: category not found by ID';
        }
        throw error;
        }
      }
      for (const child of toDeleteCategory.childrenIDs) {
        try {
          const currentChild = await this.findById(child);
          currentChild.ancestorIDs.splice(currentChild.ancestorIDs.indexOf(categoryID));
          currentChild.parentID = toDeleteCategory.parentID;
          await this.replaceById(child, currentChild);
        } catch (error) {
        if (error.code === 'ENTITY_NOT_FOUND') {
          return 'Unexpected error: category not found by ID';
        }
        throw error;
        }
      }
      await this.delete(toDeleteCategory);
      await this.updateProfessionOnCategoryDeleted(profession, categoryID);
      return `Succesfully deleted ${toDeleteCategory.categoryName} from tree`;
    } catch (error) {
    if (error.code === 'ENTITY_NOT_FOUND') {
      return 'Unexpected error: category not found by ID';
    }
    throw error;
    }
  }

  async updateProfessionOnCategoryDeleted(
    profession: ProfessionRepository,
    categoryID: string
  ): Promise<void> {
    try {
      const professionsContainingCurrentCategoryID = await profession.find({where: {
        categorysKnown: {
          regexp: categoryID
        }
      }});
      for (const currentProfession of professionsContainingCurrentCategoryID) {
        currentProfession.categorysKnown.splice(currentProfession.categorysKnown.indexOf(categoryID), 1);
        await profession.replaceById(currentProfession.professionID, currentProfession);
      }
    } catch (error) {
    if (error.code === 'ENTITY_NOT_FOUND') {
      return;
    }
    throw error;
    }
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
