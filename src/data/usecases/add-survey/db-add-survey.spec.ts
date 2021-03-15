import { AddSurveyModel } from '../../../domain/usecases/add-survey'
import { AddSurveyRepository } from '../../protocols/db/survey/add-survey-repository'
import { DbAddSurvey } from './db-add-survey'

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (survey: AddSurveyModel): Promise<void> {
      return new Promise(resolve => resolve(null))
    }
  }
  return new AddSurveyRepositoryStub()
}

const makeFakeAddSurvey = (): AddSurveyModel => {
  return {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
}

describe('DbAddSurvey Use Case', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const addSurvey = makeFakeAddSurvey()
    await sut.add(addSurvey)
    expect(addSpy).toHaveBeenCalledWith(addSurvey)
  })
})
