
import { RequiredFieldValidator } from '../../presentation/helper/validators/required-field-validator'
import { ValidatorComposite } from '../../presentation/helper/validators/validator-composite'
import { Validator } from '../../presentation/helper/validators/validator'

export const makeSignUpValidator = (): ValidatorComposite => {
  const validations: Validator[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidator(field))
  }
  return new ValidatorComposite(validations)
}
