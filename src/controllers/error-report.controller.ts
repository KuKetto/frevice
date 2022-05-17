import {repository} from '@loopback/repository';
import {
  get, param, patch, post, requestBody, response
} from '@loopback/rest';
import {ErrorReport, Task} from '../models';
import {DeviceCategorysRepository, DeviceRepository, ErrorReportRepository, TaskRepository, UserDataRepository} from '../repositories';
import {errorReportRequestBody} from '../requestSchemas/error_report';

export class ErrorReportController {
  constructor(
    @repository(ErrorReportRepository)
    public errorReportRepository : ErrorReportRepository,
    @repository(DeviceCategorysRepository)
    public deviceCategorysRepository : DeviceCategorysRepository,
    @repository(DeviceRepository)
    public deviceRepository : DeviceRepository,
    @repository(DeviceRepository)
    public taskRepository : TaskRepository,
    @repository(DeviceRepository)
    public userDataRepository : UserDataRepository,
  ) {}

  @get('/error-reports')
  @response(200, {
    description: 'List error reports',})
  async getErrorList(): Promise<Array<object>> {
    return this.errorReportRepository.getErrors();
  }

  @get('/error-reports/${errorID}')
  @response(200, {
    description: 'List error reports',})
  async getErrorInfo(
    @param.path.string('errorID') errorID: string
  ): Promise<object> {
    return this.errorReportRepository.getErrorInfo(errorID, this.deviceRepository, this.deviceCategorysRepository, this.userDataRepository);
  }

  @post('/error-reports')
  @response(200, {
    description: 'Make error report',})
  async newErrorReport(
    @requestBody(errorReportRequestBody) error: {'fullname': string, 'phone': string, 'productID': string, 'desc': string},
  ): Promise<ErrorReport> {
    return this.errorReportRepository.newErrorReport(error.fullname, error.phone, error.productID, error.desc);
  }

  @patch('/error-reports')
  @response(200, {
    description: 'Make error to task',})
  async makeErrorToTask(
    @requestBody(errorReportRequestBody) error: {'deviceID': string, 'employeeID': string},
  ): Promise<Task> {
    return this.errorReportRepository.makeErrorToTask(error.deviceID, error.employeeID, this.taskRepository);
  }
}
