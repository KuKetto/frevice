import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {del, get, param, patch, put, requestBody, response} from '@loopback/rest';
import {DeviceCategorys, MaintanceRequirements} from '../models';
import {DeviceCategorysRepository, ProfessionRepository} from '../repositories';
import {deviceCategoryInsertRequestBody, deviceCategoryRequestBody, deviceCategoryUpdateRequestBody, testGenRequestBody} from '../requestSchemas/deviceCategories';

@authenticate('jwt')
export class DeviceCategoryController {
  constructor(
    @repository(DeviceCategorysRepository)
    public deviceCategorysRepository : DeviceCategorysRepository,
    @repository(ProfessionRepository)
    public professionRepository : ProfessionRepository
  ) {}

  @patch('/device-categories')
  @response(200, {
    description: 'Add new deviceCategory',
  })
  async createNewCategory(
    @requestBody(deviceCategoryRequestBody) newDeviceCategory: {'parentCategoryID':string, 'categoryName':string, 'defaultMaintanceSchedule':number, 'maintanceRequirements': Array<MaintanceRequirements>}
  ): Promise<string> {
    return this.deviceCategorysRepository.newCategory(newDeviceCategory.parentCategoryID, newDeviceCategory.categoryName, newDeviceCategory.defaultMaintanceSchedule, newDeviceCategory.maintanceRequirements, this.professionRepository);
  }

  @patch('/device-categories/${categoryID}')
  @response(200, {
    description: 'Update deviceCategory data by ID',
  })
  async updateCategory(
    @requestBody(deviceCategoryUpdateRequestBody) updateCategory: {'categoryName':string, 'defaultMaintanceSchedule':number, 'maintanceRequirements': Array<MaintanceRequirements>},
    @param.path.string('categoryID') categoryID: typeof DeviceCategorys.prototype.categoryID
  ): Promise<DeviceCategorys | string> {
    return this.deviceCategorysRepository.updadeCategory(categoryID, updateCategory.categoryName, updateCategory.defaultMaintanceSchedule, updateCategory.maintanceRequirements);
  }

  @get('/device-categories/${categoryID}')
  @response(200, {
    description: 'Get device info by ID',
  })
  async getCategoryInfo(
    @param.path.string('categoryID') categoryID: typeof DeviceCategorys.prototype.categoryID
  ): Promise<object> {
    return this.deviceCategorysRepository.getByID(categoryID);
  }

  @get('/device-categories')
  @response(200, {
    description: 'Get DeviceCategorys hirearchy model',
  })
  async getHiearchyTree(): Promise<Array<object>> {
    return this.deviceCategorysRepository.getHierarchyTree();
  }

  @patch('/device-categories/${parentCategoryID}')
  @response(200, {
    description: 'Insert category inside a tree',
  })
  async insertIntoTree(
    @requestBody(deviceCategoryInsertRequestBody) newDeviceCategory: {'whichChildID':string, 'categoryName':string, 'defaultMaintanceSchedule':number, 'maintanceRequirements': Array<MaintanceRequirements>},
    @param.path.string('parentCategoryID') parentCategoryID: typeof DeviceCategorys.prototype.categoryID
  ): Promise<DeviceCategorys | string> {
    return this.deviceCategorysRepository.insertIntoTree(parentCategoryID, newDeviceCategory.whichChildID,newDeviceCategory.categoryName, newDeviceCategory.defaultMaintanceSchedule, newDeviceCategory.maintanceRequirements, this.professionRepository);
  }

  @del('/device-categories/${categoryID}')
  @response(200, {
    description: 'Delete category',
  })
  async deleteFromTree(
    @param.path.string('categoryID') categoryID: typeof DeviceCategorys.prototype.categoryID
  ): Promise<DeviceCategorys | string> {
    return this.deviceCategorysRepository.deleteFromTree(categoryID, this.professionRepository);
  }

  @put('/test')
  @response(200, {
    description: 'Make test categories by n times',
  })
  async genNRandomValue(
    @requestBody(testGenRequestBody) testGen: {'n':number, 'parentID': string}
 ): Promise<void> {
    let i = 0;
    await this.deviceCategorysRepository.newCategory(testGen.parentID, `${i}`, 1, [], this.professionRepository);
    i++;
    for (i; i<testGen.n; i++) {
      const treeBuildingOrRootChance = Math.floor(Math.random() * ((100) - 0 + 1) + 0);
      if (treeBuildingOrRootChance < 75) {
        const randomNum = Math.floor(Math.random() * ((i-1) - 0 + 1) + 0);
        const getRandomParent = await this.deviceCategorysRepository.findOne({where: {
          categoryName: `${randomNum}`
        }});
        if (getRandomParent?.categoryID === undefined) return;
        await this.deviceCategorysRepository.newCategory(getRandomParent?.categoryID, `${i}`, 1, [], this.professionRepository);
      } else {
        await this.deviceCategorysRepository.newCategory(testGen.parentID, `${i}`, 1, [], this.professionRepository);
      }
    }
  }

  @del('/test')
  @response(200, {
    description: 'Drop all dump test category',
  })
  async deleteTestData(): Promise<void> {
    await this.deviceCategorysRepository.deleteAll();
    return;
  }

  @get('/device-categories/tree')
  @response(200, {
    description: 'Get roots',
  })
  async getRoots(): Promise<Array<object>> {
    return this.deviceCategorysRepository.getRoots();
  }

  @get('/device-categories/tree/${categoryID}')
  @response(200, {
    description: 'Get child of parents',
  })
  async getChildOfParents(
    @param.path.string('categoryID') categoryID: typeof DeviceCategorys.prototype.categoryID
  ): Promise<Array<object>> {
    return this.deviceCategorysRepository.getChildOfParent(categoryID);
  }
}
