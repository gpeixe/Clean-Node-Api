import { Controller, HttpRequest } from '@/presentation/protocols'
import { Request, Response, RequestHandler } from 'express'

export const adaptRoute = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      pathParameters: req.params,
      accountId: req.accountId  
    }
    const httpResponse = await controller.handle(httpRequest)
    const statusCode = httpResponse.statusCode
    if (statusCode === 200 || statusCode <= 299) {
      res.status(statusCode).json(httpResponse.body)
    } else {
      res.status(statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
