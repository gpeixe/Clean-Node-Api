import { serverError, forbidden } from '@/presentation/helpers/http/http-helper'
import { LoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { SurveyModel } from '@/domain/models/survey'
import { HttpRequest } from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors'
import { SaveSurveyResult } from '@/domain/useCases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import MockDate from 'mockdate'

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyById: LoadSurveyById
  saveSurveyResult: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyById = makeLoadSurveyById()
  const saveSurveyResult = makeSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyById, saveSurveyResult)
  return {
    sut,
    loadSurveyById,
    saveSurveyResult
  }
}

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(): Promise<SurveyModel> {
      return await new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(): Promise<SurveyResultModel> {
      return await new Promise(resolve => resolve(makeFakeSurveyResult()))
    }
  }
  return new SaveSurveyResultStub()
}

const makeFakeSurvey = (): SurveyModel => ({
  id: '1',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: '1',
  surveyId: '1',
  accountId: '1',
  answer: 'any_answer',
  date: new Date()
})


const makeFakeRequest = (): HttpRequest => {
  return {
    pathParameters: {
      surveyId: 'any_survey_id'
    },
    body: {
      answer: 'any_answer'
    },
    accountId: 'any_account_id'
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyById } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyById, 'loadById')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith(httpRequest.pathParameters.surveyId)
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyById } = makeSut()
    jest.spyOn(loadSurveyById, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyById } = makeSut()
    jest.spyOn(loadSurveyById, 'loadById').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    httpRequest.body.answer = 'wrong_answer'
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call saveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResult } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResult, 'save')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    const { surveyId } = httpRequest.pathParameters
    const { accountId } = httpRequest
    const { answer } = httpRequest.body
    expect(saveSpy).toHaveBeenCalledWith({ surveyId, accountId, answer, date: new Date()})
  })
})
