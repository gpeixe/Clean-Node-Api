import { Collection } from 'mongodb'
import { AddAccountModel } from '../../../../../domain/usecases/add-account'
import { MongoHelper } from '../../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

let accountCollection: Collection

const makeAddAccount = (): AddAccountModel => {
  return {
    name: 'any_name',
    email: 'any_email@email.com.br',
    password: 'any_password'
  }
}

describe('Account MongoDb Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const addAccount = makeAddAccount()
    const account = await sut.add(addAccount)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(addAccount.name)
    expect(account.email).toBe(addAccount.email)
    expect(account.password).toBe(addAccount.password)
  })

  test('Should return an account on LoadByEmail success', async () => {
    const sut = makeSut()
    const addAccount = makeAddAccount()
    await accountCollection.insertOne(addAccount)
    const account = await sut.loadByEmail(addAccount.email)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(addAccount.name)
    expect(account.email).toBe(addAccount.email)
    expect(account.password).toBe(addAccount.password)
  })
})
