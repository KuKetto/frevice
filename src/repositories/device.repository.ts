import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DeviceCategorysRepository, ProfessionRepository} from '.';
import {MongoDbDataSource} from '../datasources';
import {Device, DeviceRelations} from '../models';
import {genID} from '../services/id-gen';

export class DeviceRepository extends DefaultCrudRepository<
  Device,
  typeof Device.prototype.deviceID,
  DeviceRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Device, dataSource);
  }

  async createNewDevice(
  deviceName: string,
  categoryID: string,
  professionRepo: ProfessionRepository,
  productID: string,
  location: string,
  description: string,
  ): Promise<Device> {
    return this.create({
      deviceID: await this.genDID(),
      deviceName: deviceName,
      categoryID: categoryID,
      professionIDs: await this.fetchProfessionIDsFromCategoryID(categoryID, professionRepo),
      productID: productID,
      location: location,
      description: description
    })
  }

  async updateDevice(
    deviceID: string,
    deviceName: string,
    categoryID: string,
    professionRepo: ProfessionRepository,
    productID: string,
    location: string,
    description: string,
  ): Promise<Device | string> {
    try {
      const device = await this.findById(deviceID);
      if(deviceName !== undefined) device.deviceName = deviceName;
      if(categoryID !== undefined) {
        device.categoryID = categoryID;
        device.professionIDs = await this.fetchProfessionIDsFromCategoryID(categoryID, professionRepo);
      }
      if(productID !== undefined) device.productID = productID;
      if(location !== undefined) device.location = location;
      if(description !== undefined) device.description = description;
      await this.replaceById(deviceID, device);
      return device;
    } catch (error) {
    if (error.code === 'ENTITY_NOT_FOUND') {
      return 'Unexpected error: Device not found by ID';
    }
    throw error;
    }
  }

  async fetchProfessionIDsFromCategoryID(
    categoryID: string,
    professionRepo: ProfessionRepository
  ): Promise<string[]> {
    try {
      const professions = await professionRepo.find({where: {
        categorysKnown: {
          regexp: categoryID
        }
      }})
      const responseArray: string[] = [];
      for (const profession of professions) responseArray.push(profession.professionID);
      return responseArray;
    } catch (error) {
    if (error.code === 'ENTITY_NOT_FOUND') {
      return [];
    }
    throw error;
    }
  }

  async getDeviceList(): Promise<Array<object> | string> {
    try {
      const devices = await this.find()
      const responseArray: Array<{
        deviceID: string,
        deviceName: string
      }> = [];
      for (const device of devices) responseArray.push({
        deviceID: device.deviceID,
        deviceName: device.deviceName
      });
      return responseArray;
    } catch (error) {
      if (error.code === 'ENTITY_NOT_FOUND') {
        return 'no device added yet'
      }
      return error;
    }
  }

  async getDeviceInfo(
    deviceID: string,
    categoryRepo: DeviceCategorysRepository,
    professionRepo: ProfessionRepository
  ): Promise<object> {
    try {
      const device = await this.findById(deviceID)
      let professions = '';
      for (let i = 0; i < device.professionIDs.length; i++) {
        if (i < device.professionIDs.length-1) professions += await this.getProfession(device.professionIDs[i], professionRepo) + ', ';
        else professions += await this.getProfession(device.professionIDs[i], professionRepo);
      }
      return {
        deviceName: device.deviceName,
        categoryPath: await this.getCategoryPath(deviceID, categoryRepo),
        professions: professions,
        productID: device.productID,
        location: device.location,
        description: device.description
      }
    } catch (error) {
      if (error.code === 'ENTITY_NOT_FOUND') {
        return {}
      }
      return error;
    }
  }

  async getProfession(
    professionID: string,
    professionRepo: ProfessionRepository
  ): Promise<string> {
    try {
      const profession = await professionRepo.findById(professionID)
      return profession.professionName;
    } catch (error) {
      if (error.code === 'ENTITY_NOT_FOUND') {
        return ''
      }
      return error;
    }
  }

  async getCategoryPath(
    deviceID: string,
    categoryRepo: DeviceCategorysRepository
  ): Promise<string> {
    try {
      const device = await this.findById(deviceID);
      const responseStringArray: string[] = [];
      let category: {categoryName: string,
        parentID: string};
      let parentID = device.categoryID;
      do {
        category = await this.recursiveParentFinder(parentID, categoryRepo);
        responseStringArray.push(category.categoryName);
        parentID = category.parentID;
      } while (parentID !== undefined)
      let responseString = '';
      for (let i = responseStringArray.length-1; i >= 0; i--) {
        if (i > 0) responseString += `${responseStringArray[i]} >> `
        else responseString += responseStringArray[i]
      }
      return responseString;
    } catch (error) {
    if (error.code === 'ENTITY_NOT_FOUND') {
      return 'Unexpected error: Device not found by ID';
    }
    throw error;
    }
  }

  async recursiveParentFinder(
    parentID: string,
    categoryRepo: DeviceCategorysRepository
  ): Promise<{
    categoryName: string,
    parentID: string
  }> {
    try {
      const category = await categoryRepo.findById(parentID);
      return {
        categoryName: category.categoryName,
        parentID: category.parentID
      }
    } catch (error) {
    if (error.code === 'ENTITY_NOT_FOUND') {
      return {categoryName:'',parentID:''}
    }
    throw error;
    }
  }

  async deleteDeviceById(
    deviceID: string
  ): Promise<string> {
    try {
      const device = await this.findById(deviceID);
      const deviceName = device.deviceName;
      await this.delete(device);
      return `Succesfully deleted ${deviceName}`;
    } catch (error) {
    if (error.code === 'ENTITY_NOT_FOUND') {
      return 'Device not found by ID'
    }
    throw error;
    }
  }

  async genDID(): Promise<string> {
    const id = genID();
    return await this.checkDID(id) === false ? id : this.genDID();
  }

  async checkDID(id: string): Promise<Device | boolean> {
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
