import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {
  get, param, patch, post, requestBody, response
} from '@loopback/rest';
import {Task} from '../models';
import {DeviceCategorysRepository, DeviceRepository, TaskRepository, UserDataRepository} from '../repositories';
import {changeStatusRequestBody, createTaskRequestBody} from '../requestSchemas/task';

@authenticate('jwt')
export class TaskController {
  constructor(
    @repository(TaskRepository) public taskRepository : TaskRepository,
    @repository(DeviceRepository) public deviceRepository : DeviceRepository,
    @repository(DeviceCategorysRepository) public deviceCategorysRepository : DeviceCategorysRepository,
    @repository(UserDataRepository) public userDataRepository : UserDataRepository,
  ) {}

  @get('/tasks/todo')
  @response(200, {
    description: 'List all tasks without employee'
  })
  async getTaskList(): Promise<Array<object>> {
    return this.taskRepository.getTaskList(this.deviceRepository, this.deviceCategorysRepository);
  }

  @get('/tasks')
  @response(200, {
    description: 'List all tasks without employee'
  })
  async getTasksList(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  @get('/tasks/${deviceID}/employees')
  @response(200, {
    description: 'List all employees with required professions'
  })
  async employeesWorkable(
    @param.path.string('deviceID') deviceID: string
  ): Promise<Array<object>> {
    return this.taskRepository.employeesWorkable(deviceID, this.userDataRepository, this.deviceRepository);
  }

  @get('/tasks/${employeeID}')
  @response(200, {
    description: 'List all tasks for employee'
  })
  async listEmployeeTasks(
    @param.path.string('employeeID') employeeID: string
  ): Promise<Array<object>> {
    return this.taskRepository.listEmployeeTasks(employeeID, this.deviceRepository);
  }

  @post('/tasks')
  @response(200, {
    description: 'Create new task'
  })
  async createTask(
    @requestBody(createTaskRequestBody) newTask: {'employeeID': string, 'deviceID': string, 'type': string, 'date': number}
  ): Promise<Task> {
    return this.taskRepository.createTask(newTask.employeeID, newTask.deviceID, newTask.type, newTask.date);
  }

  @patch('/tasks')
  @response(200, {
    description: 'Change status of task'
  })
  async changeStatus(
    @requestBody(changeStatusRequestBody) newStatus: {'taskID': string, 'status': string, 'reason': string}
  ): Promise<string> {
    return this.taskRepository.changeStatus(newStatus.taskID, newStatus.status, newStatus.reason, this.deviceRepository, this.deviceCategorysRepository);
  }
}
