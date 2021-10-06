import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result-controller'
import { Controller } from '@/presentation/protocols'
import { makDbSaveSurveyResult } from '@/main/factories/usecases/survey-results/save-survey-result/db-save-survey-result-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const loadSurveysController = new SaveSurveyResultController(makeDbLoadSurveyById(), makDbSaveSurveyResult())
  return makeLogControllerDecorator(loadSurveysController)
}
