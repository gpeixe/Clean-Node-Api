import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import env from '../config/env'

let accountCollection: Collection


describe('PUT /surveys/:surveyId/results', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })
  
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('Should return 403 if no access token is provided', async () => {
    await request(app)
      .put('/api/surveys/survey_id/results')
      .send({
        answer: 'any_answer'
      })
      .expect(403)
  })
})
