import { CourseEntity } from './course.entity'
import { RegisterCourseDto } from './dtos/register-course.dto'
import { UpdateCourseDto } from './dtos/update-course.dto'

export abstract class CourseDataSource {
  abstract listCourse(): Promise<CourseEntity[]>
  abstract getCourse(id: number): Promise<CourseEntity>
  abstract registerCourse(
    registerCourseDto: RegisterCourseDto,
  ): Promise<CourseEntity>
  abstract updateCourse(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<CourseEntity>
  abstract deleteCourse(id: number): Promise<boolean>
}
