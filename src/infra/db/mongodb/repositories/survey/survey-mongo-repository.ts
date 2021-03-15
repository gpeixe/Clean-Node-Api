import { Collection } from 'mongodb'
import { AddSurveyModel, AddSurveyRepository } from '../../../../../data/usecases/add-survey/db-add-survey-protocols'
import { MongoHelper } from '../../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  private async getSurveyCollection (): Promise<Collection> {
    return await MongoHelper.getCollection('surveys')
  }

  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await this.getSurveyCollection()
    await surveyCollection.insertOne(surveyData)
  }
}
