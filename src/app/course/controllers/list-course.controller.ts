import { Request, Response } from 'express'
import { HandleError } from '../../../helpers/errors/handle-error'
import database from '../../../config/database'
import { CourseService } from '../course.service'
import { CustomResponse } from '../../../helpers/custom/custom-response'

export const listCourse = async (req: Request, res: Response) => {
  try {
    const courseService = new CourseService(database)
    const courses = await courseService.listCourse()

    CustomResponse.execute({
      message: 'Courses listed successfully',
      res,
      data: courses,
    })
  } catch (error) {
    HandleError.execute(error, 'listCourse', res)
  }
}
