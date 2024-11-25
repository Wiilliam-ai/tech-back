import { Request, Response } from 'express'
import { HandleError } from '../../../helpers/errors/handle-error'
import { getFileProperty } from '../../../utils/getFileProperty'
import { CustomError } from '../../../helpers/errors/custom-error'
import { CustomResponse } from '../../../helpers/custom/custom-response'
import { RegisterLessonDto } from '../dtos/register-lesson.dto'
import { LessonService } from '../lesson.service'
import database from '../../../config/database'
import { UploadFile } from '../../../utils/uploadFile'

export const registerLesson = async (req: Request, res: Response) => {
  try {
    const dataFiles = getFileProperty(req.file)
    // Todo: Pasar la validación otra función o un middleware
    if (!dataFiles.isData) throw CustomError.notFound('File not found')
    const typeFile = dataFiles.mimetype.split('/')[0]
    if (typeFile !== 'video') throw CustomError.badRequest('Invalid file type')
    const types = ['video/mp4', 'video/webm', 'video/ogg', 'x-matroska']
    const isValidType = types.includes(dataFiles.mimetype)
    if (!isValidType) throw CustomError.badRequest('Invalid file type')
    req.body.videoUrl = dataFiles.randomname

    const [error, registerLessonDto] = RegisterLessonDto.check(req.body)

    if (error) throw CustomError.badRequest(error)

    const lessonService = new LessonService(database)

    const lesson = await lessonService.registerLesson(registerLessonDto!)
    const isSaved = lesson.title === registerLessonDto!.title
    if (isSaved)
      UploadFile.saveVideo(lesson.videoUrl, 'lessons', dataFiles.buffer)

    CustomResponse.execute({
      res,
      status: 201,
      message: 'Lesson created successfully',
    })
  } catch (error) {
    HandleError.execute(error, 'registerLesson', res)
  }
}
