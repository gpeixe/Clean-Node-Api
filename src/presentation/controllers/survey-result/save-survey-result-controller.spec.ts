import { serverError, ok, noContent } from '@/presentation/helpers/http/http-helper'
import { LoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { SurveyModel } from '@/domain/models/survey'
import { HttpRequest } from '@/presentation/protocols'

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
      id: 'any_survey_id'
    }
  }
}

describe('SaveSurveyResult Controller', () => {
  test('Should chall LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyById } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyById, 'loadById')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith(httpRequest.pathParameters.id)
  })
})
