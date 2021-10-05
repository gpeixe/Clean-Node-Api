import { SaveSurveyResultRepository, SurveyResultModel, SaveSurveyResultModel } from './db-save-survey-result-protocols'
import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepository: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepository = makeSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepository)
  return {
    sut,
    saveSurveyResultRepository
  }
}

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (survey: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve({
        answer: 'any_answer',
        surveyId: 'any_survey_id',
        accountId: 'any_account_id',
        id: 'any_id',
        date: new Date()
      }))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const makeFakeSaveSurveyResult = (): SaveSurveyResultModel => {
  return {
    answer: 'any_answer',
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    date: new Date()
  }
}

describe('DbAddSurvey Use Case', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultRepository } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepository, 'save')
    const saveSurveyResult = makeFakeSaveSurveyResult()
    await sut.save(saveSurveyResult)
    expect(saveSpy).toHaveBeenCalledWith(saveSurveyResult)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepository } = makeSut()
    jest.spyOn(saveSurveyResultRepository, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const saveSurveyResult = makeFakeSaveSurveyResult()
    const promise = sut.save(saveSurveyResult)
    await expect(promise).rejects.toThrow()
  })

  test('Should return a SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(makeFakeSaveSurveyResult())
    expect(surveyResult).toEqual({
      answer: 'any_answer',
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      id: 'any_id',
      date: new Date()
    })
  })
})
