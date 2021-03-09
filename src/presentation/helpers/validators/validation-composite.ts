import { Validation } from '../../protocols/validation'

export class ValidationComposite implements Validation {
  constructor (
    private readonly validations: Validation[]
  ) {}

  validate (input: any): Error {
    for (const validator of this.validations) {
      const error = validator.validate(input)
      if (error) {
        return error
      }
    }
  }
}
