import { Collection } from 'mongodb'
import { AddAccountRepository } from '../../../../../data/protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../../data/protocols/db/load-account-by-email-repository'
import { AccountModel } from '../../../../../domain/models/account'
import { AddAccountModel } from '../../../../../domain/usecases/add-account'
import { MongoHelper } from '../../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  private async getAccountCollection (): Promise<Collection> {
    return await MongoHelper.getCollection('accounts')
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await this.getAccountCollection()
    const account = await accountCollection.findOne({ email })
    return MongoHelper.map(account)
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await this.getAccountCollection()
    const result = await accountCollection.insertOne(accountData)
    const account = result.ops[0]
    return MongoHelper.map(account)
  }
}
