import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { Validation } from '../../../../presentation/protocols/validation'
import { ValidationComposite, RequiredFieldValidation } from '../../../../validation/validators'

jest.mock('../../../../validation/validators/validation-composite')

describe('SignUpValidator Factory', () => {
  test('Should call ValidatorComposite with all Validators', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
