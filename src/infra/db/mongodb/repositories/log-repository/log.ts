import { LogErrorRepository } from '../../../../../data/protocols/log-error-repository'

export class LogRepository implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    return new Promise(resolve => resolve())
  }
}
