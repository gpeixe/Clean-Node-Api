import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly secret: string
  ) {}

  async decrypt (value: string): Promise<string> {
    await jwt.verify(value, this.secret)
    return await new Promise(resolve => resolve(null))
  }

  async encrypt (value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret)
    return accessToken
  }
}
