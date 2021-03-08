import { ValidationComposite } from '../../../presentation/helper/validators/validation-composite'
import { RequiredFieldValidation } from '../../../presentation/helper/validators/required-field-validation'
import { makeLoginValidator } from './login-validator'
import { Validation } from '../../../presentation/helper/validators/validation'
import { EmailValidation } from '../../../presentation/helper/validators/email-validation'
import { EmailValidator } from '../../../presentation/protocols'

jest.mock('../../../presentation/helper/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidator Factory', () => {
  test('Should call ValidatorComposite with all Validators', () => {
    makeLoginValidator()
    const validations: Validation[] = []
    for (const field of ['name', 'email']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
