import { Middleware, HttpRequest } from '../../presentation/protocols'
import { Request, Response, RequestHandler, NextFunction } from 'express'

export const adaptMiddleware = (middleware: Middleware): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    const httpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      next()
    }
    res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message
    })
  }
}
