import { Request, Response } from 'express'
import { HandleError } from '../../../helpers/errors/handle-error'
import { getFileProperty } from '../../../utils/getFileProperty'
import { CustomError } from '../../../helpers/errors/custom-error'
import { UpdateCourseDto } from '../dtos/update-course.dto'
import { CustomResponse } from '../../../helpers/custom/custom-response'
import { CourseService } from '../course.service'
import database from '../../../config/database'
import { UploadFile } from '../../../utils/uploadFile'

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const dataFiles = getFileProperty(req.file)
    // Todo: Pasar la validación otra función o un middleware
    if (dataFiles.isData) {
      const typeFile = dataFiles.mimetype.split('/')[0]
      if (typeFile !== 'image')
        throw CustomError.badRequest('Invalid file type')
      const types = ['image/jpeg', 'image/jpg', 'image/webp']
      const isValidType = types.includes(dataFiles.mimetype)
      if (!isValidType) throw CustomError.badRequest('Invalid file type')
      req.body.img = dataFiles.randomname
    }

    const { id } = req.params
    const [error, updateCourseDto] = UpdateCourseDto.check(req.body)

    if (error) throw CustomError.badRequest(error)

    const courseService = new CourseService(database)

    const course = await courseService.updateCourse(
      Number(id),
      updateCourseDto!,
    )
    if (dataFiles.isData) {
      const isSaved = course.name === updateCourseDto!.name
      if (isSaved) UploadFile.saveImage(course.img, 'courses', dataFiles.buffer)
    }

    CustomResponse.execute({
      res,
      status: 200,
      data: updateCourseDto,
      message: 'Course updated successfully',
    })
  } catch (error) {
    HandleError.execute(error, 'updateCourse', res)
  }
}
