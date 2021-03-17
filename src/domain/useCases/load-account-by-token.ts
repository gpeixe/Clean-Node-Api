import { AccountModel } from '../models/account'

export interface LoadAccountByToken {
  loadByToken: (token: string) => Promise<AccountModel>
}
