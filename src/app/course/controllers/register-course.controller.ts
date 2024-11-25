import { Request, Response } from 'express'
import { getFileProperty } from '../../../utils/getFileProperty'
import { HandleError } from '../../../helpers/errors/handle-error'
import { CustomError } from '../../../helpers/errors/custom-error'
import { RegisterCourseDto } from '../dtos/register-course.dto'
import { CourseService } from '../course.service'
import database from '../../../config/database'
import { UploadFile } from '../../../utils/uploadFile'
import { CustomResponse } from '../../../helpers/custom/custom-response'
import { HttpStatus } from '../../../config/http-status'

export const registerCourse = async (req: Request, res: Response) => {
  try {
    const dataFiles = getFileProperty(req.file)
    // Todo: Pasar la validación otra función o un middleware
    if (!dataFiles.isData) throw CustomError.notFound('File not found')
    const typeFile = dataFiles.mimetype.split('/')[0]
    if (typeFile !== 'image') throw CustomError.badRequest('Invalid file type')
    const types = ['image/jpeg', 'image/jpg', 'image/webp']
    const isValidType = types.includes(dataFiles.mimetype)
    if (!isValidType) throw CustomError.badRequest('Invalid file type')
    req.body.img = dataFiles.randomname

    const [error, registerCourseDto] = RegisterCourseDto.check(req.body)

    if (error) throw CustomError.badRequest(error)

    const courseService = new CourseService(database)
    const course = await courseService.registerCourse(registerCourseDto!)
    const isSaved = course.name === registerCourseDto!.name
    if (isSaved) UploadFile.saveImage(course.img, 'courses', dataFiles.buffer)

    CustomResponse.execute({
      res,
      status: HttpStatus.CREATED,
      data: course,
      message: 'Course created successfully',
    })
  } catch (error) {
    HandleError.execute(error, 'registerCourse', res)
  }
}
