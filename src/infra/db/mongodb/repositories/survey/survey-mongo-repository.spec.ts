import { Collection } from 'mongodb'
import { MongoHelper } from '../../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { AddSurveyModel } from '@/data/usecases/add-survey/db-add-survey-protocols'
import env from '@/main/config/env'

let surveyCollection: Collection

const makeFakeAddSurvey = (): AddSurveyModel => {
  return {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      answer: 'other_answer'
    }],
    date: new Date()
  }
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey MongoDb Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('add', () => {
    test('Should create an survey on add success', async () => {
      const sut = makeSut()
      const addSurvey = makeFakeAddSurvey()
      await sut.add(addSurvey)
      const survey = await surveyCollection.findOne({ question: addSurvey.question })
      expect(survey).toBeTruthy()
    })
    test('Should not return on success', async () => {
      const sut = makeSut()
      const response = await sut.add(makeFakeAddSurvey())
      expect(response).toBeFalsy()
    })
  })
  describe('load', () => {
    test('Should load all surveys on success', async () => {
      const sut = makeSut()
      await surveyCollection.insertMany([makeFakeAddSurvey()])
      const surveys = await sut.load()
      expect(surveys.length).toBe(1)
      expect(surveys[0].question).toBe('any_question')
    })

    test('Should load empty list if no items in survey collection', async () => {
      const sut = makeSut()
      const surveys = await sut.load()
      expect(surveys.length).toBe(0)
    })
  })
})
