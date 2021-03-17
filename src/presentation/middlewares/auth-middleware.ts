import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers ? httpRequest.headers['x-access-token'] : null
    if (!accessToken) {
      const error = forbidden(new AccessDeniedError())
      return new Promise(resolve => resolve(error))
    }
    await this.loadAccountByToken.loadByToken(accessToken)
  }
}
