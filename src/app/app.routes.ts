import { Router } from 'express'
import { AuthRoutes } from './auth/auth.routes'
import { UserRoutes } from './user/user.routes'

export class AppRoutes {
  static get routes(): Router {
    const router = Router()
    router.use('/auth', AuthRoutes.routes)
    router.use('/users', UserRoutes.routes)
    return router
  }
}
