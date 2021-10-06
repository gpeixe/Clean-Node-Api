import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import env from '../config/env'
import { sign } from 'jsonwebtoken'

let accountCollection: Collection
let surveyCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Rodrigo',
    email: 'rodrigo.manguinho@gmail.com',
    password: '123',
    role: 'admin'
  })
  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}


describe('PUT /surveys/:surveyId/results', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })
  
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
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

  test('Should return 200 on success', async () => {
    const accessToken = await makeAccessToken()
    const res = await surveyCollection.insertOne({
      question: 'Question',
      answers: [{
        answer: 'Answer 1',
        image: 'http://image-name.com'
      }, {
        answer: 'Answer 2'
      }],
      date: new Date()
    })
    const id = res.ops[0]._id
    await request(app)
      .put(`/api/surveys/${id}/results`)
      .set('x-access-token', accessToken)
      .send({
        answer: 'Answer 1',
      })
      .expect(200)
  })
})
