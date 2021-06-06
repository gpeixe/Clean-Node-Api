import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'
import { Collection } from 'mongodb'
import { AddSurveyModel, AddSurveyRepository } from '@/data/usecases/add-survey/db-add-survey-protocols'
import { MongoHelper } from '../../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  private async getSurveyCollection (): Promise<Collection> {
    return await MongoHelper.getCollection('surveys')
  }

  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await this.getSurveyCollection()
    await surveyCollection.insertOne(surveyData)
  }

  async load (): Promise<SurveyModel[]> {
    return (await this.getSurveyCollection()).find().toArray()
  }
}
