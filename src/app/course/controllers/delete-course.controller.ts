import { Request, Response } from 'express'
import { HandleError } from '../../../helpers/errors/handle-error'
import { CourseService } from '../course.service'
import database from '../../../config/database'
import { CustomResponse } from '../../../helpers/custom/custom-response'
import { HttpStatus } from '../../../config/http-status'

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const courseService = new CourseService(database)
    await courseService.deleteCourse(Number(id))
    CustomResponse.execute({
      res,
      status: HttpStatus.OK,
      message: 'Course deleted successfully',
    })
  } catch (error) {
    HandleError.execute(error, 'deleteCourse', res)
  }
}
