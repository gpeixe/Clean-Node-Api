import { Collection } from 'mongodb'
import { MongoHelper } from '../../helpers/mongo-helper'
import { LogMongoRepository } from './log-mongo-repository'
import env from '@/main/config/env'

describe('Log Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): LogMongoRepository => {
    return new LogMongoRepository()
  }

  test('Should call LogMongoRepository with correct value', async () => {
    const sut = makeSut()
    const logSpy = jest.spyOn(sut, 'logError')
    const error = 'any_error'
    await sut.logError(error)
    expect(logSpy).toHaveBeenCalledWith(error)
  })

  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
