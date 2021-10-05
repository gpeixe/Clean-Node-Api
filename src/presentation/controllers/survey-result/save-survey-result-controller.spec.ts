import { serverError, ok, noContent, forbidden } from '@/presentation/helpers/http/http-helper'
import { LoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { SurveyModel } from '@/domain/models/survey'
import { HttpRequest } from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors'

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyById: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyById = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyById)
  return {
    sut,
    loadSurveyById
  }
}

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(): Promise<SurveyModel> {
      return await new Promise(resolve => resolve(makeSurvey()))
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSurvey = (): SurveyModel => ({
  id: '1',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})


const makeFakeRequest = (): HttpRequest => {
  return {
    pathParameters: {
      surveyId: 'any_survey_id'
    },
    body: {
      answer: 'any_answer'
    }
  }
}

describe('SaveSurveyResult Controller', () => {
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
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })
})
