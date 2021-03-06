import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  },
  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call bcrypt with correct value', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })
    test('Should return a hash on success', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash')
    })
    test('Should throw if bcrypt hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })
  describe('compare()', () => {
    test('Should call compare with correct value', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('value', 'hashed_value')
      expect(compareSpy).toHaveBeenCalledWith('value', 'hashed_value')
    })

    test('Should return true on compare success', async () => {
      const sut = makeSut()
      const isValid = await sut.compare('value', 'hashed_value')
      expect(isValid).toBe(true)
    })

    test('Should return false on compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
      const isValid = await sut.compare('value', 'hashed_value')
      expect(isValid).toBe(false)
    })

    test('Should throw if bcrypt compare throws', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
      const promise = sut.compare('value', 'hashed_value')
      await expect(promise).rejects.toThrow()
    })
  })
})
