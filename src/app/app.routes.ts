import { Router } from 'express'
import { AuthRoutes } from './auth/auth.routes'
import { UserRoutes } from './user/user.routes'
import { CourseRoutes } from './course/course.routes'
import { LessonRoutes } from './lesson/lesson.routes'
import { DocsRoutes } from './docs/docs.routes'

export class AppRoutes {
  static get routes(): Router {
    const router = Router()
    router.use('/auth', AuthRoutes.routes)
    router.use('/users', UserRoutes.routes)
    router.use('/courses', CourseRoutes.routes)
    router.use('/lessons', LessonRoutes.routes)
    router.use('/docs', DocsRoutes.routes)
    return router
  }
}
