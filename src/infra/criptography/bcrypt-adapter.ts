import { Hasher } from '../../data/protocols/criptography/hasher'
import { HashComparer } from '../../data/protocols/criptography/hash-comparer'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare (value: string, valueToCompare: string): Promise<boolean> {
    const compare = await bcrypt.compare(value, valueToCompare)
    return compare
  }
}
