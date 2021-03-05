import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helper/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'
import { Authentication } from '../../../domain/useCases/authentication'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }
      await this.authentication.auth(email, password)
      return new Promise(resolve => resolve(null))
    } catch (error) {
      return serverError(error)
    }
  }
}
