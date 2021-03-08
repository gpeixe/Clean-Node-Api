import { SignUpController } from '../../../presentation/controllers/signup/signup'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/repositories/account-repository/account'
import { LogControllerDecorator } from '../../decorators/log'
import { Controller } from '../../../presentation/protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/repositories/log-repository/log'
import { makeSignUpValidator } from './signup-validator'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const validatorComposite = makeSignUpValidator()
  const signUpController = new SignUpController(validatorComposite, dbAddAccount)
  const logRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logRepository)
}