import { LoadSurveyById } from "@/domain/useCases/survey/load-survey-by-id";
import { InvalidParamError } from "@/presentation/errors";
import { forbidden, serverError } from "@/presentation/helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols";

export class SaveSurveyResultController implements Controller {

  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.pathParameters.surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const { answer } = httpRequest.body
      if (!survey.answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
      }
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}