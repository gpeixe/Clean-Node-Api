import { ServerError } from '../../presentation/errors'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { ok } from '../../presentation/helper/http-helper'
import { AccountModel } from '../../domain/models/account'

describe('LogController Decorator', () => {
  interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
  }

  const makeLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
      async log (stack: string): Promise<void> {
        return new Promise(resolve => resolve(null))
      }
    }
    return new LogErrorRepositoryStub()
  }

  const makeController = (): Controller => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: makeFakeAccount()
        }
        return new Promise(resolve => resolve(httpResponse))
      }
    }
    return new ControllerStub()
  }

  const makeSut = (): SutTypes => {
    const logErrorRepositoryStub = makeLogErrorRepository()
    const controllerStub = makeController()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    return {
      sut: sut,
      controllerStub: controllerStub,
      logErrorRepositoryStub: logErrorRepositoryStub
    }
  }

  const makeFakeRequest = (): HttpRequest => {
    return {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
  }

  const makeFakeAccount = (): AccountModel => {
    return {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
  }

  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const serverError = new ServerError(fakeError.stack)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve({
      statusCode: 500,
      body: serverError
    })))
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
