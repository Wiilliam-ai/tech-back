import { Router } from 'express'
import { registerUser } from './controllers/register-user.controller'
import { completeUser } from './controllers/complete-user.controller'
import { AuthMiddleware } from '../../helpers/middlewares/auth-midleware'
import { listUsers } from './controllers/list-user.controller'
import { forwardEmail } from './controllers/forward-email.controller'
import { FilesMiddleware } from '../../helpers/middlewares/files-midleware'
import { uploadAvatar } from './controllers/upload-avatar.controller'

export class UserRoutes {
  static get routes(): Router {
    const router = Router()
    const upload = FilesMiddleware.upload

    router.get('/', AuthMiddleware.verifyToken, listUsers)
    router.post('/', AuthMiddleware.verifyToken, registerUser)
    router.post('/forward-email', AuthMiddleware.verifyToken, forwardEmail)
    router.post('/complete', completeUser)
    router.post(
      '/avatar',
      upload.single('avatar'),
      AuthMiddleware.verifyToken,
      uploadAvatar,
    )
    return router
  }
}
