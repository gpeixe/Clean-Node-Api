import { EmailValidator } from '../presentation/protocols'

export class EmailValidatorAdapter implements EmailValidator {
  // private readonly validator = validator

  isValid (email: string): boolean {
    // validator.valid(email)
    return false
  }
}
