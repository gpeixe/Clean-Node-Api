import { Router } from 'express'
import { makeSignUpController } from '../factories/controllers/authentication/signup/signup'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController } from '../factories/controllers/authentication/login/login-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
