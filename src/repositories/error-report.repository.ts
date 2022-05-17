import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DeviceCategorysRepository, DeviceRepository} from '.';
import {MongoDbDataSource} from '../datasources';
import {ErrorReport, ErrorReportRelations, Task} from '../models';
import {genID} from '../services/id-gen';
import {TaskRepository} from './task.repository';
import {UserDataRepository} from './user-data.repository';

export class ErrorReportRepository extends DefaultCrudRepository<
  ErrorReport,
  typeof ErrorReport.prototype.errorID,
  ErrorReportRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(ErrorReport, dataSource);
  }

  async newErrorReport(
    fullname: string,
    phone: string,
    productID: string,
    desc: string
  ): Promise<ErrorReport> {
    return this.create({
      errorID: await this.genEID(),
      fullname: fullname,
      phone: phone,
      productID: productID,
      desc: desc
    })
  }

  async onErrorMadeTask(errorID: string): Promise<string> {
    await this.deleteById(errorID);
    return "success";
  }

  async getErrors(): Promise<Array<object>>{
    const errors = await this.find();
    const responseArray = [];
    for (const error of errors) {
      responseArray.push({
        errorID: error.errorID,
        fullname: error.fullname,
        desc: error.desc
      })
    }
    return responseArray;
  }

  async makeErrorToTask(
    deviceID: string,
    employeeID: string,
    taskRepo: TaskRepository
  ): Promise<Task> {
    return taskRepo.createTask(employeeID, deviceID, 'error', Date.now()/1000);
  }

  async getErrorInfo(
    errorID: string,
    deviceRepo: DeviceRepository,
    deviceCatRepo: DeviceCategorysRepository,
    userRepo: UserDataRepository
    ): Promise<object> {
    const error = await this.findById(errorID);
    const device = await deviceRepo.findOne({where: {
      productID: error.productID
    }});
    let category = "Rosszul megadott vagy hiányzó termékazonosító miatt nem meghatározható";
    const employeesWorkable = [];
    if (device !== null) {
      category = (await deviceCatRepo.findById(device.categoryID)).categoryName;
      const taskProfessions = (await deviceRepo.findById(device.deviceID)).professionIDs;
      const employees = await userRepo.find();
      for (const employee of employees) {
        if (taskProfessions.every(id => employee.employeeData.professionKnownIDs.includes(id))) {
          employeesWorkable.push({
            employeeID: employee.employeeData.employeeID,
            employeeName: employee.employeeData.employeeName
          })
        }
      }
    }

    return {
      fullname: error.fullname,
      phone: error.phone,
      productID: error.productID,
      deviceInfo: device === null ? "Nem találtunk eszközt a megadott termékazonosító alapján" : `Eszköz neve: ${device.deviceName},
      az eszköz elhelyezkedése: ${device.location}, utolsó karbantartás ideje: ${device.lastMaintance}`,
      deviceCategory: category,
      deviceID: device === null ? "További egyeztetésre van szükség" : device.deviceID,
      desc: error.desc,
      employeeWorkable: device === null ? "További egyeztetésre van szükség" : employeesWorkable
    }
  }

  async genEID(): Promise<string> {
    const id = genID();
    return await this.checkEID(id) === false ? id : this.genEID();
  }

  async checkEID(id: string): Promise<ErrorReport | boolean> {
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
