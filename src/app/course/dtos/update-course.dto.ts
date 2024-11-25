export class UpdateCourseDto {
  constructor(
    public readonly name?: string,
    public readonly description?: string,
    public readonly skills?: string[],
    public readonly img?: string,
  ) {}

  static check(obj: any): [error?: string, UpdateCourseDto?: UpdateCourseDto] {
    const { name, description, skills, img } = obj

    const keys = Object.keys(obj)
    const existKeys = keys.length > 0
    if (!existKeys) return ['No data found']

    const arraySkills = skills ? skills.split(',') : undefined
    return [undefined, new UpdateCourseDto(name, description, arraySkills, img)]
  }
}
