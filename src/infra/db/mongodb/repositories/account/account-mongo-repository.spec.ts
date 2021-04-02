import { Collection } from 'mongodb'
import { AddAccountModel } from '../../../../../domain/usecases/add-account'
import { MongoHelper } from '../../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
import env from '../../../../../main/config/env'

let accountCollection: Collection

const makeAddAccount = (): AddAccountModel => {
  return {
    name: 'any_name',
    email: 'any_email@email.com.br',
    password: 'any_password'
  }
}

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account MongoDb Repository', () => {
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

  describe('add()', () => {
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
  })

  describe('loadByEmail()', () => {
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
  })

  describe('updateAccessToken()', () => {
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

  describe('loadByToken', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com.br',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com.br')
      expect(account.password).toBe('any_password')
    })
  })
})
