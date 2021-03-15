import { SignUpController } from '../../../../presentation/controllers/authentication/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSignUpValidator } from './signup-validator'
import { makeDbAuthentication } from '../../usecases/db-authentication-factory'
import { makeDbAddAccount } from '../../usecases/db-add-account-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const dbAddAccount = makeDbAddAccount()
  const dbAuthentication = makeDbAuthentication()
  const validatorComposite = makeSignUpValidator()
  const signUpController = new SignUpController(validatorComposite, dbAddAccount, dbAuthentication)
  return makeLogControllerDecorator(signUpController)
}
