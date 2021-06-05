import { LoadSurveysController } from './load-surveys-controller'
import { SurveyModel, HttpRequest, LoadSurveys } from './load-surveys-controller-protocols'

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new LoadSurveysStub()
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: null
  }
}

describe('LoadSurveys Controller', () => {
  test('Should call LoadSurveys.load', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSurveysSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSurveysSpy).toHaveBeenCalled()
  })
})
