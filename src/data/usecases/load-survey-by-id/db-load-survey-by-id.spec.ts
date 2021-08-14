import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
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
        return Promise.resolve({
          id: 'any_id',
          question: 'any_question',
          date: new Date(),
          answers: [{
            answer: 'any_answer'
          }]
        })
      }
    }
    const loadSurveyByIdRepository = new LoadSurveyByIdRepositoryStub()
    return loadSurveyByIdRepository
  }

  test('Should call loadSurveyByIdRepository with correct values', async () => {
    const { sut, loadSurveyByIdRepository } = makeSut()
    const loadById = jest.spyOn(loadSurveyByIdRepository, 'loadById')
    await sut.loadById('any_id')
    expect(loadById).toHaveBeenCalledWith('any_id')
  })
})
