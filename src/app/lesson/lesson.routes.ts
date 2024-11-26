import { Router } from 'express'
import { registerLesson } from './controllers/register-lesson.controller'
import { FilesMiddleware } from '../../helpers/middlewares/files-midleware'

export class LessonRoutes {
  static get routes(): Router {
    const router = Router()
    const upload = FilesMiddleware.upload
    router.post('/', upload.single('video'), registerLesson)
    router.get('/:id')
    return router
  }
}
