import { AddSurveyController } from './add-survey-controller'
import { Validation } from '../../../protocols/validation'
import { badRequest } from '../../../helpers/http/http-helper'
import { HttpRequest } from '../../../protocols'

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new AddSurveyController(validationStub)
  return {
    sut,
    validationStub
  }
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      question: 'any_question',
      answers: ['1_anwser', '2_anwser', '2_anwser']
    }
  }
}

describe('AddSurvey Controller', () => {
  test('Should returns 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_field')))
  })
})
