import { Request, Response } from 'express'
import { HandleError } from '../../../helpers/errors/handle-error'
import database from '../../../config/database'
import { CourseService } from '../course.service'
import { CustomResponse } from '../../../helpers/custom/custom-response'

export const getCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const courseService = new CourseService(database)
    const course = await courseService.getCourse(Number(id))

    CustomResponse.execute({
      res,
      data: course,
      message: 'Course found successfully',
    })
  } catch (error) {
    HandleError.execute(error, 'getCourse', res)
  }
}
