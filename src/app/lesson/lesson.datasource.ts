import { RegisterLessonDto } from './dtos/register-lesson.dto'
import { LessonEntity } from './lesson.entity'

export abstract class LessonDataSource {
  abstract registerLesson(
    registerLessonDto: RegisterLessonDto,
  ): Promise<LessonEntity>
}
