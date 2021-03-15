import { LoginController } from '../../../../presentation/controllers/authentication/login/login-controller'
import { Controller } from '../../../../presentation/controllers/authentication/login/login-controller-protocols'
import { makeLoginValidation } from './login-validation-factory'
import { makeDbAuthentication } from '../../usecases/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const dbAuthentication = makeDbAuthentication()
  const loginController = new LoginController(dbAuthentication, makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
