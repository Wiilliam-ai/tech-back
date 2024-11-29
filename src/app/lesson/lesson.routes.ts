import { Router } from 'express'
import { registerLesson } from './controllers/register-lesson.controller'
import { FilesMiddleware } from '../../helpers/middlewares/files-midleware'
import { getLessonsByCourseId } from './controllers/get-lesson-by-course.controller'

export class LessonRoutes {
  static get routes(): Router {
    const router = Router()
    const upload = FilesMiddleware.upload
    router.post('/', upload.single('video'), registerLesson)
    router.post('/byCourse', getLessonsByCourseId)
    return router
  }
}
