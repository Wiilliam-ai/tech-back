import { Router } from 'express'
import { loginUser } from './controllers/login-user.controller'
import { verifyUser } from './controllers/verify-user.controller'
import { AuthMiddleware } from '../../helpers/middlewares/auth-midleware'
import { recoverUser } from './controllers/recover-user.controller'
import { completeRecover } from './controllers/complete-recver.controller'

export class AuthRoutes {
  static get routes(): Router {
    const router = Router()
    router.post('/login', loginUser)
    router.post('/recover', recoverUser)
    router.post('/complete-recover', completeRecover)
    router.post('/verify', AuthMiddleware.verifyToken, verifyUser)
    return router
  }
}
