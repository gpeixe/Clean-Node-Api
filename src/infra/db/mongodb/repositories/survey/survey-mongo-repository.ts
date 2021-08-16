import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'
import { Collection } from 'mongodb'
import { AddSurveyModel, AddSurveyRepository } from '@/data/usecases/add-survey/db-add-survey-protocols'
import { MongoHelper } from '../../helpers/mongo-helper'
import { LoadSurveyByIdRepository } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id-protocols'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  private async getSurveyCollection (): Promise<Collection> {
    return await MongoHelper.getCollection('surveys')
  }

  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await this.getSurveyCollection()
    await surveyCollection.insertOne(surveyData)
  }

  async load (): Promise<SurveyModel[]> {
    const surveys = (await this.getSurveyCollection()).find().toArray()
    return surveys && MongoHelper.mapCollection(await surveys)
  }

  async loadById (surveyId: string): Promise<SurveyModel> {
    const survey = await (await this.getSurveyCollection()).findOne({ _id: surveyId })
    return survey && MongoHelper.map(survey)
  }
}
