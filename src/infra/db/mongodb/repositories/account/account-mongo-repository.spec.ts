import { Collection } from 'mongodb'
import { AddAccountModel } from '../../../../../domain/usecases/add-account'
import { MongoHelper } from '../../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

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

  test('Should return an account on loadByEmail success', async () => {
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

  test('Should return null if loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@email.com')
    expect(account).toBeFalsy()
  })

  test('Should update the account accessToken on updateAcessToken success', async () => {
    const sut = makeSut()
    const addAccount = makeAddAccount()
    const res = await accountCollection.insertOne(addAccount)
    const accountId = res.ops[0]._id
    await sut.updateAccessToken(accountId, 'any_token')
    const account = await accountCollection.findOne({ email: addAccount.email })
    expect(account).toBeTruthy()
    expect(account.accessToken).toBe('any_token')
  })
})
