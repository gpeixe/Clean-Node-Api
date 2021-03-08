import { Authentication, LoadAccountByEmailRepository, AuthenticationModel } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email)
    return new Promise(resolve => resolve('any_token'))
  }
}
