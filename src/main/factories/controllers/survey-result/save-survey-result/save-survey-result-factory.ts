import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result'
import { DbLoadSurveyById } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/repositories/survey-result/survey-result-mongo-repository'
import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories/survey/survey-mongo-repository'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result-controller'
import { Controller } from '@/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const surveyMongoRepository = new SurveyMongoRepository()
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  const saveSurveyResult = new DbSaveSurveyResult(surveyResultMongoRepository)
  const loadSurveyById = new DbLoadSurveyById(surveyMongoRepository)
  const loadSurveysController = new SaveSurveyResultController(loadSurveyById, saveSurveyResult)
  return makeLogControllerDecorator(loadSurveysController)
}
