import { SaveSurveyResult } from "@/domain/useCases/survey-result/save-survey-result";
import { LoadSurveyById } from "@/domain/useCases/survey/load-survey-by-id";
import { InvalidParamError } from "@/presentation/errors";
import { forbidden, serverError } from "@/presentation/helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols";

export class SaveSurveyResultController implements Controller {

  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
    ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.pathParameters.surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const { answer } = httpRequest.body
      const answers = survey.answers.map(answer => answer.answer)
      if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
      }
      const { surveyId } = httpRequest.pathParameters
      await this.saveSurveyResult.save({
        surveyId,
        accountId: httpRequest.accountId,
        answer,
        date: new Date()
      })
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}