import { PrismaClient } from '@prisma/client'
import { RegisterLessonDto } from './dtos/register-lesson.dto'
import { LessonDataSource } from './lesson.datasource'
import { LessonEntity, LessonsData } from './lesson.entity'
import { CustomError } from '../../helpers/errors/custom-error'

export class LessonService implements LessonDataSource {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async getLessonsByCourseId(courseId: number): Promise<LessonsData[]> {
    const lessons = await this.prisma.lesson.findMany({
      where: {
        courseId,
        deleted: false,
      },
      include: {
        resources: true,
        docs: true,
      },
    })

    const mappLessons: LessonsData[] = lessons.map((lesson) => {
      return {
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        description: lesson.description,
        resources: {
          id: lesson.resources.id,
          url: lesson.resources.url,
        },
      }
    })

    return mappLessons
  }

  async getLessonById(id: number): Promise<LessonEntity> {
    throw new Error('Method not implemented.')
  }

  async registerLesson(
    registerLessonDto: RegisterLessonDto,
  ): Promise<LessonEntity> {
    const { title, description, content, courseId, videoUrl } =
      registerLessonDto

    // videoUrl = 1234.mp4
    const videoUrlFile = videoUrl.split('.')

    const newResource = await this.prisma.resource.create({
      data: {
        url: videoUrlFile[0],
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
