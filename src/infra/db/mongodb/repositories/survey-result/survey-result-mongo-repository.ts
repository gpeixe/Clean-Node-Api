import { Collection } from 'mongodb'
import { MongoHelper } from '../../helpers/mongo-helper'
import { SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from '@/data/usecases/save-survey-result/db-save-survey-result-protocols'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  private async getSurveyResultsCollection (): Promise<Collection> {
    return await MongoHelper.getCollection('surveyResults')
  }

  async save (surveyResult: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultsCollection = await this.getSurveyResultsCollection()
    const res = await surveyResultsCollection.findOneAndUpdate({ surveyId: surveyResult.surveyId, accountId: surveyResult.accountId }, {
      $set: {
        answer: surveyResult.answer,
        date: surveyResult.date
      }
    }, {
      upsert: true,
      returnOriginal: false
    })
    return res.value && MongoHelper.map(res.value)
  }
}
