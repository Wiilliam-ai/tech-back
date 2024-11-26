import { Router } from 'express'
import { registerUser } from './controllers/register-user.controller'
import { completeUser } from './controllers/complete-user.controller'
import { AuthMiddleware } from '../../helpers/middlewares/auth-midleware'
import { listUsers } from './controllers/list-user.controller'
import { forwardEmail } from './controllers/forward-email.controller'

export class UserRoutes {
  static get routes(): Router {
    const router = Router()
    router.get('/', AuthMiddleware.verifyToken, listUsers)
    router.post('/', AuthMiddleware.verifyToken, registerUser)
    router.post('/forward-email', AuthMiddleware.verifyToken, forwardEmail)
    router.post('/complete', completeUser)
    return router
  }
}
