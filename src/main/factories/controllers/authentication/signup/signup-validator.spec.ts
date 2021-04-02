import { makeSignUpValidator } from './signup-validator'
import { Validation } from '../../../../../presentation/protocols/validation'
import { EmailValidator } from '../../../../../validation/protocols/email-validator'
import { EmailValidation, ValidationComposite, RequiredFieldValidation, CompareFieldsValidation } from '../../../../../validation/validators'

jest.mock('../../../../../validation/validators/validation-composite')

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
