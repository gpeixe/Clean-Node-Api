import { Controller } from '../../../../../presentation/controllers/authentication/login/login-controller-protocols'
import { AddSurveyController } from '../../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbAddSurvey } from '../../../usecases/survey/add-survey/db-add-survey-factory'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(addSurveyController)
}
