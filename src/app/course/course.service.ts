import { PrismaClient } from '@prisma/client'
import { CourseDataSource } from './course.datasource'
import { CourseEntity } from './course.entity'
import { RegisterCourseDto } from './dtos/register-course.dto'
import { CustomError } from '../../helpers/errors/custom-error'
import { UpdateCourseDto } from './dtos/update-course.dto'
import { UploadFile } from '../../utils/uploadFile'

export class CourseService implements CourseDataSource {
  private pristma: PrismaClient

  constructor(pristma: PrismaClient) {
    this.pristma = pristma
  }
  async deleteCourse(id: number): Promise<boolean> {
    const existsCourse = await this.pristma.course.findUnique({
      where: {
        id,
      },
      include: {
        resources: true,
      },
    })

    if (!existsCourse) throw CustomError.notFound('Course not found')
    if (existsCourse && existsCourse.deleted)
      throw CustomError.badRequest('Course not found')

    const courseDeleted = await this.pristma.course.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    })

    if (!courseDeleted) throw CustomError.badRequest('Error to delete course')

    UploadFile.deleteImage(existsCourse.resources.url, 'courses')

    return true
  }
  async updateCourse(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<CourseEntity> {
    const existsCourse = await this.pristma.course.findUnique({
      where: {
        id,
      },
      include: {
        resources: true,
      },
    })

    if (!existsCourse) throw CustomError.notFound('Course not found')
    if (existsCourse && existsCourse.deleted)
      throw CustomError.badRequest('Course not found')

    if (!updateCourseDto.img) {
      console.log('entro')
      const courseUpdated = await this.pristma.course.update({
        where: {
          id,
        },
        data: {
          name: updateCourseDto.name || existsCourse.name,
          description: updateCourseDto.description || existsCourse.description,
          skills: updateCourseDto.skills
            ? updateCourseDto.skills.join(',')
            : existsCourse.skills,
        },
      })

      if (!courseUpdated) throw CustomError.badRequest('Error to update course')

      return {
        id: courseUpdated.id,
        name: courseUpdated.name,
        description: courseUpdated.description,
        skills: courseUpdated.skills.split(','),
        img: `courses/${existsCourse.img}`,
      }
    }

    const updateResource = await this.pristma.resource.update({
      where: {
        id: existsCourse.img,
      },
      data: {
        url: updateCourseDto.img,
      },
    })

    if (!updateResource) throw CustomError.badRequest('Error to update image')

    UploadFile.deleteImage(existsCourse.resources.url, 'courses')

    const courseUpdated = await this.pristma.course.update({
      where: {
        id,
      },
      data: {
        name: updateCourseDto.name || existsCourse.name,
        description: updateCourseDto.description || existsCourse.description,
        skills: updateCourseDto.skills
          ? updateCourseDto.skills.join(',')
          : existsCourse.skills,
      },
    })

    if (!courseUpdated) throw CustomError.badRequest('Error to update course')

    return {
      id: courseUpdated.id,
      name: courseUpdated.name,
      description: courseUpdated.description,
      skills: courseUpdated.skills.split(','),
      img: `courses/${courseUpdated.img}`,
    }
  }

  async listCourse(): Promise<CourseEntity[]> {
    const courses = await this.pristma.course.findMany({
      include: {
        resources: true,
      },
    })

    const listMapped =
      courses.map((course) => ({
        id: course.id,
        name: course.name,
        description: course.description,
        skills: course.skills.split(','),
        img: `courses/${course.resources.url}`,
      })) || []

    return listMapped
  }
  async getCourse(id: number): Promise<CourseEntity> {
    const course = await this.pristma.course.findFirst({
      where: {
        id,
      },
      include: {
        resources: true,
      },
    })

    if (!course) throw CustomError.notFound('Course not found')

    return {
      id: course.id,
      name: course.name,
      description: course.description,
      skills: course.skills.split(','),
      img: `courses/${course.resources.url}`,
    }
  }

  async registerCourse(
    registerCourseDto: RegisterCourseDto,
  ): Promise<CourseEntity> {
    const { name, description, skills, img } = registerCourseDto
    const existCourse = await this.pristma.course.findFirst({
      where: {
        name,
      },
    })

    if (existCourse) throw CustomError.badRequest('Course already exists')

    const textSkills = skills.join(',')

    const newImg = await this.pristma.resource.create({
      data: {
        url: img,
      },
    })

    if (!newImg) throw new Error('Error to create image')

    const course = await this.pristma.course.create({
      data: {
        name,
        description,
        skills: textSkills,
        img: newImg.id,
      },
    })

    if (!course) throw new Error('Error to create course')

    return {
      id: course.id,
      name: course.name,
      description: course.description,
      skills: course.skills.split(','),
      img: newImg.url,
    }
  }
}
