import {authenticate} from '@loopback/authentication';
import {
  repository
} from '@loopback/repository';
import {
  del,
  get,
  param,
  patch,
  post, requestBody,
  response
} from '@loopback/rest';
import {Device} from '../models';
import {DeviceCategorysRepository, DeviceRepository, ProfessionRepository} from '../repositories';
import {createDeviceRequestBody, updateDeviceRequestBody} from '../requestSchemas/device';

@authenticate('jwt')
export class DeviceController {
  constructor(
    @repository(DeviceRepository)
    public deviceRepository : DeviceRepository,
    @repository(DeviceCategorysRepository)
    public deviceCategorysRepository : DeviceCategorysRepository,
    @repository(ProfessionRepository)
    public professionRepository : ProfessionRepository,
  ) {}

  @post('/devices')
  @response(200, {
    description: 'Add new device',
  })
  async create(
    @requestBody(createDeviceRequestBody) newDevice: {'deviceName':string, 'categoryID':string, 'productID':string, 'location':string, 'description':string}
  ): Promise<Device> {
    return this.deviceRepository.createNewDevice(newDevice.deviceName, newDevice.categoryID, this.professionRepository, newDevice.productID, newDevice.location, newDevice.description, this.deviceCategorysRepository);
  }

  @patch('/devices/${deviceID}')
  @response(200, {
    description: 'Update device by ID',
  })
  async update(
    @requestBody(updateDeviceRequestBody) deviceToUpdate: {'deviceName':string, 'categoryID':string, 'productID':string, 'location':string, 'description':string},
    @param.path.string('deviceID') deviceID: typeof Device.prototype.deviceID
  ): Promise<Device | string> {
    return this.deviceRepository.updateDevice(deviceID, deviceToUpdate.deviceName, deviceToUpdate.categoryID, this.professionRepository, deviceToUpdate.productID, deviceToUpdate.location, deviceToUpdate.description);
  }

  @get('/devices')
  @response(200, {
    description: 'Get list of devices',
  })
  async getDevices(): Promise<Array<object> | string> {
    return this.deviceRepository.getDeviceList();
  }

  @get('/devices/${deviceID}')
  @response(200, {
    description: 'Get device info by ID',
  })
  async getDevice(
    @param.path.string('deviceID') deviceID: typeof Device.prototype.deviceID
  ): Promise<object> {
    return this.deviceRepository.getDeviceInfo(deviceID, this.deviceCategorysRepository, this.professionRepository);
  }

  @del('/devices/${deviceID}')
  @response(200, {
    description: 'Delete device by ID',
  })
  async deleteDevice(
    @param.path.string('deviceID') deviceID: typeof Device.prototype.deviceID
  ): Promise<string> {
    return this.deviceRepository.deleteDeviceById(deviceID);
  }

}
