import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/repositories/survey-result/survey-result-mongo-repository'

export const makDbSaveSurveyResult = (): DbSaveSurveyResult => {
  const saveSurveyResultMongoRepository = new SurveyResultMongoRepository()
  const dbSaveSurveyResult = new DbSaveSurveyResult(saveSurveyResultMongoRepository)
  return dbSaveSurveyResult
}
