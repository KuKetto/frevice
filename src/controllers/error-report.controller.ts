import {repository} from '@loopback/repository';
import {
  get, param, post, requestBody, response
} from '@loopback/rest';
import {ErrorReport} from '../models';
import {DeviceCategorysRepository, DeviceRepository, ErrorReportRepository} from '../repositories';
import {errorReportRequestBody} from '../requestSchemas/error_report';

export class ErrorReportController {
  constructor(
    @repository(ErrorReportRepository)
    public errorReportRepository : ErrorReportRepository,
    @repository(DeviceCategorysRepository)
    public deviceCategorysRepository : DeviceCategorysRepository,
    @repository(DeviceRepository)
    public deviceRepository : DeviceRepository,
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
    return this.errorReportRepository.getErrorInfo(errorID, this.deviceRepository, this.deviceCategorysRepository);
  }

  @post('/error-reports')
  @response(200, {
    description: 'Make error report',})
  async newErrorReport(
    @requestBody(errorReportRequestBody) error: {'fullname': string, 'phone': string, 'productID': string, 'desc': string},
  ): Promise<ErrorReport> {
    return this.errorReportRepository.newErrorReport(error.fullname, error.phone, error.productID, error.desc);
  }
}
