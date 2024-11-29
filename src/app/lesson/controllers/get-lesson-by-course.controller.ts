import { Request, Response } from 'express'
import { HandleError } from '../../../helpers/errors/handle-error'
import { CustomError } from '../../../helpers/errors/custom-error'
import { LessonService } from '../lesson.service'
import database from '../../../config/database'
import { CustomResponse } from '../../../helpers/custom/custom-response'

interface IBody {
  courseId: number
}

export const getLessonsByCourseId = async (req: Request, res: Response) => {
  try {
    const { courseId }: IBody = req.body

    if (!courseId) throw CustomError.badRequest('id of course is required')

    const lessonService = new LessonService(database)

    const lessons = await lessonService.getLessonsByCourseId(courseId)

    CustomResponse.execute({
      message: '',
      res,
      data: lessons,
    })
  } catch (error) {
    HandleError.execute(error, 'listlessons', res)
  }
}
