import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden, ok } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'
import { HttpRequest } from '../protocols'

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return {
    sut,
    loadAccountByTokenStub
  }
}

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async loadByToken (token: string): Promise<AccountModel> {
      const account: AccountModel = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
      return new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByTokenStub()
}

const makeFakeRequest = (): HttpRequest => {
  return {
    headers: {
      'x-access-token': 'any_token'
    }
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith(httpRequest.headers['x-access-token'])
  })
  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
  })
})
