import { ValidationComposite } from '../../presentation/helper/validators/validation-composite'
import { RequiredFieldValidation } from '../../presentation/helper/validators/required-field-validation'
import { makeSignUpValidator } from './signup-validatior'
import { Validation } from '../../presentation/helper/validators/validation'
import { CompareFieldsValidation } from '../../presentation/helper/validators/compare-fields-validation'
import { EmailValidation } from '../../presentation/helper/validators/email-validation'
import { EmailValidator } from '../../presentation/protocols'

jest.mock('../../presentation/helper/validators/validation-composite')

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
    makeSignUpValidator()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
