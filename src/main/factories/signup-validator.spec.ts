import { ValidatorComposite } from '../../presentation/helper/validators/validator-composite'
import { RequiredFieldValidator } from '../../presentation/helper/validators/required-field-validator'
import { makeSignUpValidator } from './signup-validatior'
import { Validator } from '../../presentation/helper/validators/validator'
import { CompareFieldsValidator } from '../../presentation/helper/validators/compare-fields-validator'

jest.mock('../../presentation/helper/validators/validator-composite')

describe('SignUpValidator Factory', () => {
  test('Should call ValidatorComposite with all Validators', () => {
    makeSignUpValidator()
    const validations: Validator[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidator(field))
    }
    validations.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
    expect(ValidatorComposite).toHaveBeenCalledWith(validations)
  })
})
