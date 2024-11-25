import { Router } from 'express'
import { registerCourse } from './controllers/register-course.controller'
import { updateCourse } from './controllers/update-course.controller'
import { deleteCourse } from './controllers/delete-course.controller'
import { getCourse } from './controllers/get-course.controller'
import { listCourse } from './controllers/list-course.controller'
import { FilesMiddleware } from '../../helpers/middlewares/files-midleware'

export class CourseRoutes {
  static get routes(): Router {
    const upload = FilesMiddleware.upload
    const router = Router()
    router.get('/', listCourse)
    router.get('/:id', getCourse)
    router.post('/', upload.single('img'), registerCourse)
    router.put('/:id', upload.single('img'), updateCourse)
    router.delete('/:id', deleteCourse)
    return router
  }
}
