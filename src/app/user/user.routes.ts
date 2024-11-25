import { Router } from 'express'
import { registerUser } from './controllers/register-user.controller'
import { completeUser } from './controllers/complete-user.controller'
import { AuthMiddleware } from '../../helpers/middlewares/auth-midleware'

export class UserRoutes {
  static get routes(): Router {
    const router = Router()
    router.post('/', AuthMiddleware.verifyToken, registerUser)
    router.post('/complete', completeUser)
    return router
  }
}
