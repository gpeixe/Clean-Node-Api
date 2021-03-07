import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('firstFieldName', 'secondFieldName')
}

describe('Required Field Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      firstFieldName: 'any_field',
      secondFieldName: 'diff_field'
    })
    expect(error).toEqual(new InvalidParamError('secondFieldName'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      firstFieldName: 'any_field',
      secondFieldName: 'any_field'
    })
    expect(error).toBeFalsy()
  })
})
