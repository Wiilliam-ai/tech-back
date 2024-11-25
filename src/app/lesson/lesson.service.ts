import { PrismaClient } from '@prisma/client'
import { RegisterLessonDto } from './dtos/register-lesson.dto'
import { LessonDataSource } from './lesson.datasource'
import { LessonEntity } from './lesson.entity'
import { CustomError } from '../../helpers/errors/custom-error'

export class LessonService implements LessonDataSource {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async registerLesson(
    registerLessonDto: RegisterLessonDto,
  ): Promise<LessonEntity> {
    const { title, description, content, courseId, videoUrl } =
      registerLessonDto

    const newResource = await this.prisma.resource.create({
      data: {
        url: videoUrl,
      },
    })

    if (!newResource) throw CustomError.badRequest('Resource not created')

    const newLesson = await this.prisma.lesson.create({
      data: {
        title,
        description,
        content,
        courseId,
        video: newResource.id,
      },
    })

    if (!newLesson) throw CustomError.badRequest('Lesson not created')

    return {
      id: newLesson.id,
      title: newLesson.title,
      description: newLesson.description,
      content: newLesson.content,
      courseId: newLesson.courseId,
      videoUrl,
    }
  }
}