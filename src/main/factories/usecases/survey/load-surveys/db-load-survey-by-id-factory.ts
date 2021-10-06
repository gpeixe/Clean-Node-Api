import { DbLoadSurveyById } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id'
import { LoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id'
import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories/survey/survey-mongo-repository'

export const makeDbLoadSurveys = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  const dbLoadSurveys = new DbLoadSurveyById(surveyMongoRepository)
  return dbLoadSurveys
}
