import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DeviceCategorysRepository, DeviceRepository, UserDataRepository} from '.';
import {MongoDbDataSource} from '../datasources';
import {Task, TaskRelations} from '../models';
import {genID} from '../services/id-gen';

export class TaskRepository extends DefaultCrudRepository<
  Task,
  typeof Task.prototype.taskID,
  TaskRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Task, dataSource);
  }

  async getTaskList(
    deviceRepo: DeviceRepository,
    categoryRepo: DeviceCategorysRepository
  ): Promise<Array<object>> {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    const responseArray = [];
    const devices = await deviceRepo.find();
    for (const device of devices) {
      if (device.nextMaintance.getDate() < date.getDate()) {
        if (await this.findOne({where: {
          deviceID: device.deviceID
        }}) === null) responseArray.push({
          deviceID: device.deviceID,
          professionRequirement: device.professionIDs,
          expectedMaintanceTimeInMinutes: (await categoryRepo.findById(device.categoryID)).expectedMaintanceTimeInMinutes
        })
      }
    }
    return responseArray;
  }

  async createTask(
    employeeID: string,
    deviceID: string,
    type: string,
    date: Date
  ): Promise<Task> {
    return this.create({
      taskID: await this.genTID(),
      employeeID: employeeID,
      status: "To do",
      deviceID: deviceID,
      type: type,
      date: date
    })
  }

  async listEmployeeTasks(
    employeeID: string,
    deviceRepo: DeviceRepository
  ): Promise<Array<object>> {
    const responseArray = [];
    const tasks = await this.find({where: {
      employeeID: employeeID
    }});
    for (const task of tasks) {
      const device = await deviceRepo.findById(task.deviceID);
      responseArray.push({
        status: task.status,
        deviceLocation: device.location,
        deviceDesc: device.description,
        deviceName: device.deviceName
      })
    }
    return responseArray;
  }

  async employeesWorkable(
    taskID: string,
    userRepo: UserDataRepository,
    deviceRepo: DeviceRepository
  ): Promise<Array<object>> {
    const responseArray = [];
    const taskProfessions = (await deviceRepo.findById((await this.findById(taskID)).deviceID)).professionIDs;
    const employees = await userRepo.find();
    for (const employee of employees) {
      if (taskProfessions.every(id => employee.employeeData.professionKnownIDs.includes(id))) {
        responseArray.push({
          employeeID: employee.employeeData.employeeID,
          employeeName: employee.employeeData.employeeName,
          employeeCurrentTaskNum: (await this.find({where: {employeeID: employee.employeeData.employeeID}})).length
        })
      }
    }
    return responseArray;
  }

  async changeStatus(
    status: string,
    taskID: string,
    deviceRepo: DeviceRepository,
    categoryRepo: DeviceCategorysRepository
  ): Promise<string> {
    const task = await this.findById(taskID);
    if (task === undefined) return "Unexpected error: ID not found";
    task.status = status;
    await this.replaceById(taskID, task);
    if (status === "done") return this.ifDone(taskID, deviceRepo, categoryRepo);
    return "status changed";
  }

  async ifDone(
    taskID: string,
    deviceRepo: DeviceRepository,
    categoryRepo: DeviceCategorysRepository
  ): Promise<string> {
    const device = await deviceRepo.findById((await this.findById(taskID)).deviceID);
    const currentDate = new Date();
    const maintanceSchedule = (await categoryRepo.findById(device.categoryID)).defaultMaintanceSchedule;
    const nextDate = new Date(currentDate.getDate() + maintanceSchedule);
    device.lastMaintance = currentDate;
    device.nextMaintance = nextDate;
    await deviceRepo.replaceById(device.deviceID, device);
    return "success";
  }

  async genTID(): Promise<string> {
    const id = genID();
    return await this.checkTID(id) === false ? id : this.genTID();
  }

  async checkTID(id: string): Promise<Task | boolean> {
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
