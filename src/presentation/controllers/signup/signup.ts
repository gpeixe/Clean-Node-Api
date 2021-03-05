import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount, Validator } from './signup-protocols'
import { badRequest, ok, serverError } from '../../helper/http-helper'
import { InvalidParamError } from '../../errors'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly validator: Validator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, validator: Validator, addAccount: AddAccount) {
    this.validator = validator
    this.addAccount = addAccount
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, name, password } = httpRequest.body
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
