import { noContent } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation, badRequest, AddSurvey, serverError } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { answers, question } = httpRequest.body
      await this.addSurvey.add({ answers, question })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
