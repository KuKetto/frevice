import {repository} from '@loopback/repository';
import {get, patch, put, requestBody, response} from '@loopback/rest';
import {MaintanceRequirements} from '../models';
import {DeviceCategorysRepository, ProfessionRepository} from '../repositories';
import {deviceCategoryRequestBody, testGenRequestBody} from '../requestSchemas/deviceCategories';

export class DeviceCategoryController {
  constructor(
    @repository(DeviceCategorysRepository)
    public deviceCategorysRepository : DeviceCategorysRepository,
    @repository(ProfessionRepository)
    public professionRepository : ProfessionRepository
  ) {}

  @patch('/device-categories')
  @response(200, {
    description: 'DeviceCategorys model hirearchy',
  })
  async createNewCategory(
    @requestBody(deviceCategoryRequestBody) newDeviceCategory: {'parentCategoryID':string, 'categoryName':string, 'defaultMaintanceSchedule':string, 'maintanceRequirements': Array<MaintanceRequirements>}
  ): Promise<string> {
    return this.deviceCategorysRepository.newCategory(newDeviceCategory.parentCategoryID, newDeviceCategory.categoryName, newDeviceCategory.defaultMaintanceSchedule, newDeviceCategory.maintanceRequirements, this.professionRepository);
  }

  @get('/device-categories')
  @response(200, {
    description: 'DeviceCategorys model hirearchy',
  })
  async getHiearchyTree(): Promise<Array<object>> {
    return this.deviceCategorysRepository.getHierarchyTree();
  }

  @put('/test')
  @response(200, {
    description: 'DeviceCategorys model hirearchy',
  })
  async genNRandomValue(
    @requestBody(testGenRequestBody) testGen: {'n':number, 'parentID': string}
 ): Promise<void> {
    let i = 0;
    await this.deviceCategorysRepository.newCategory(testGen.parentID, `${i}`, 'testSchedule', [], this.professionRepository);
    i++;
    for (i; i<testGen.n; i++) {
      const randomNum = Math.floor(Math.random() * ((i-1) - 0 + 1) + 0);
      const getRandomParent = await this.deviceCategorysRepository.findOne({where: {
        categoryName: `${randomNum}`
      }});
      if (getRandomParent?.categoryID === undefined) return;
      await this.deviceCategorysRepository.newCategory(getRandomParent?.categoryID, `${i}`, 'testSchedule', [], this.professionRepository);
    }
  }
}
