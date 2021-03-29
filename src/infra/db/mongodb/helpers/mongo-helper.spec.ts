import { MongoHelper as sut } from './mongo-helper'
import env from '../../../../main/config/env'
describe('Mongo Helper', () => {
  beforeAll(async () => {
    console.log(process.env.MONGO_URL)
    await sut.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
