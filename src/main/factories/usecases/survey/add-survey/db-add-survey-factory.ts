import { DbAddSurvey } from '@/data/usecases/survey/add-survey/db-add-survey'
import { AddSurvey } from '@/domain/useCases/survey/add-survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories/survey/survey-mongo-repository'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  const dbAddSurvey = new DbAddSurvey(surveyMongoRepository)
  return dbAddSurvey
}
