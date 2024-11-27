import { RegisterLessonDto } from './dtos/register-lesson.dto'
import { LessonEntity, LessonsData } from './lesson.entity'

export abstract class LessonDataSource {
  abstract registerLesson(
    registerLessonDto: RegisterLessonDto,
  ): Promise<LessonEntity>
  abstract getLessonById(id: number): Promise<LessonEntity>
  abstract getLessonsByCourseId(courseId: number): Promise<LessonsData[]>
}
