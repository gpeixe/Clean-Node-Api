
import { RequiredFieldValidator } from '../../presentation/helper/validators/required-field-validator'
import { ValidatorComposite } from '../../presentation/helper/validators/validator-composite'
import { Validator } from '../../presentation/helper/validators/validator'
import { CompareFieldsValidator } from '../../presentation/helper/validators/compare-fields-validator'

export const makeSignUpValidator = (): ValidatorComposite => {
  const validations: Validator[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidator(field))
  }
  const compareFieldsValidator = new CompareFieldsValidator('password', 'passwordConfirmation')
  validations.push(compareFieldsValidator)
  return new ValidatorComposite(validations)
}
