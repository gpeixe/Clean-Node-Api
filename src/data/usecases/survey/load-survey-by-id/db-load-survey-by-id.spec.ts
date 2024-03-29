import { LoadSurveyByIdRepository, SurveyModel } from './db-load-survey-by-id-protocols'
import MockDate from 'mockdate'
import { DbLoadSurveyById } from './db-load-survey-by-id'

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  type SutTypes = {
    sut: DbLoadSurveyById
    loadSurveyByIdRepository: LoadSurveyByIdRepository
  }

  const makeSut = (): SutTypes => {
    const loadSurveyByIdRepository = makeLoadSurveyByIdRepository()
    const sut = new DbLoadSurveyById(loadSurveyByIdRepository)
    return {
      sut,
      loadSurveyByIdRepository
    }
  }

  const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
      async loadById (surveyId: string): Promise<SurveyModel> {
        return Promise.resolve(makeFakeSurvey())
      }
    }
    const loadSurveyByIdRepository = new LoadSurveyByIdRepositoryStub()
    return loadSurveyByIdRepository
  }

  const makeFakeSurvey = (): SurveyModel => {
    return {
      id: 'any_id',
      question: 'any_question',
      date: new Date(),
      answers: [{
        answer: 'any_answer'
      }]
    }
  }

  test('Should call loadSurveyByIdRepository with correct values', async () => {
    const { sut, loadSurveyByIdRepository } = makeSut()
    const loadById = jest.spyOn(loadSurveyByIdRepository, 'loadById')
    await sut.loadById('any_id')
    expect(loadById).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if loadSurveysByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepository } = makeSut()
    jest.spyOn(loadSurveyByIdRepository, 'loadById').mockImplementationOnce(async () => Promise.reject(new Error()))
    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should return a survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadById('any_id')
    expect(survey).toEqual(makeFakeSurvey())
  })
})
